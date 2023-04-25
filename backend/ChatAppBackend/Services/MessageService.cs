using AutoMapper;
using ChatAppBackend.Context;
using ChatAppBackend.Entities;
using ChatAppBackend.Helpers;
using ChatAppBackend.Models.Message.Request;
using ChatAppBackend.Models.Message.Response;
using Microsoft.EntityFrameworkCore;

namespace ChatAppBackend.Services
{

    public interface IMessageService
    {
        Task<List<MessageSentResponse>> GetMessages(int friendBoxId);
        Task<MessageSentResponse> AddMessage(MessageSentRequest message);
        Task ReadMessage(int friendBoxId);

    }
    public class MessageService:IMessageService
    {
        private readonly PostgreSqlDbContext _context;
        private readonly JwtService _jwtservice;
        private readonly IMapper _mapper;

        public MessageService(PostgreSqlDbContext context,IMapper mapper,JwtService jwtService)
        {
            
            _context = context;
            _mapper = mapper;
            _jwtservice = jwtService;
        }

        public async Task<MessageSentResponse> AddMessage(MessageSentRequest message)
        {
            var friendship = await _context.FriendBoxes.FindAsync(message.FriendBoxId);

            friendship.UpdateTime = DateTime.UtcNow;

            var newMessage = new Message
            {
                ContentText = message.ContentText,
                SentDate = DateTime.UtcNow,
                FromUserId = message.FromUserId,
                ToUserId = message.ToUserId,
                Friendship = friendship,

            };


            _context.Add(newMessage);
            await _context.SaveChangesAsync();



            var resMessage = _mapper.Map<MessageSentResponse>(newMessage);
            resMessage.FriendBoxId = message.FriendBoxId;
            resMessage.FromUser = message.FromUser;

            return resMessage;
        }

        public async Task<List<MessageSentResponse>> GetMessages(int friendBoxId)
        {
            var messages = await _context.Messages
                .Include(m => m.Friendship)
                .Where(m => m.Friendship.Id == friendBoxId)
                .ToListAsync();

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

            await _context.SaveChangesAsync();
        }
    }
}
