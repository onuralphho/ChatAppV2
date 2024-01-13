

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatAppBackend.Bussiness.Services
{

    public interface IMessageService
    {
        Task<List<MessageSentResponse>> GetMessages(int friendBoxId, int skip);
        Task<MessageSentResponse> AddMessage(MessageSentRequest message);
        Task ReadMessage(int friendBoxId);

    }
    public class MessageService : IMessageService
    {
        private readonly PostgreSqlDbContext _context;
        private readonly JwtService _jwtservice;
        private readonly IMapper _mapper;

        public MessageService(PostgreSqlDbContext context, IMapper mapper, JwtService jwtService)
        {

            _context = context;
            _mapper = mapper;
            _jwtservice = jwtService;
        }

        public async Task<MessageSentResponse> AddMessage(MessageSentRequest message)
        {
            var friendship = await _context.FriendBoxes.FindAsync(message.FriendBoxId).ConfigureAwait(false);

            friendship.UpdateTime = DateTime.UtcNow;

            var newMessage = new Message
            {
                ContentText = message.ContentText,
                ContentImageUrl = message.ContentImageUrl,
                SentDate = DateTime.UtcNow,
                FromUserId = message.FromUserId,
                ToUserId = message.ToUserId,
                Friendship = friendship,

            };

            _context.Add(newMessage);
            await _context.SaveChangesAsync().ConfigureAwait(false);

            var resMessage = _mapper.Map<MessageSentResponse>(newMessage);
            resMessage.FriendBoxId = message.FriendBoxId;
            resMessage.FromUser = message.FromUser;
            resMessage.AnimationType = message.AnimationType;

            return resMessage;
        }

        public async Task<List<MessageSentResponse>> GetMessages(int friendBoxId, int skip)
        {
            var messages = await _context.Messages
                .Include(m => m.Friendship)
                .Where(m => m.Friendship.Id == friendBoxId).OrderByDescending(m => m.SentDate).Skip(skip).Take(20)
                .ToListAsync().ConfigureAwait(false);

            return messages.Select((message) =>
            {
                var messageSentResponse = _mapper.Map<MessageSentResponse>(message);
                messageSentResponse.FriendBoxId = message.Friendship.Id;
                return messageSentResponse;
            }).ToList();
        }

        public async Task ReadMessage(int friendBoxId)
        {
            var userId = _jwtservice.UserId;
            var messages = _context.Messages.Where((m) => m.Friendship.Id == friendBoxId).ToList();



            foreach (var message in messages)
            {
                if (message.ToUserId == userId)
                {
                    message.IsRead = true;

                }
            }

            await _context.SaveChangesAsync().ConfigureAwait(false);
        }
    }
}
