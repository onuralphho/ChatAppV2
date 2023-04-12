using AutoMapper;
using ChatAppBackend.Context;
using ChatAppBackend.Entities;
using ChatAppBackend.Models;
using ChatAppBackend.Models.Message.Request;
using ChatAppBackend.Models.Message.Response;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ChatAppBackend.Hubs
{
    public class ChatHub : Hub
    {
        private readonly PostgreSqlDbContext _context;
        public readonly IMapper _mapper;


        public ChatHub(PostgreSqlDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task JoinRoom(UserConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.UserId);
        }


        public async Task SendMessage(MessageSentRequest messageSentRequest)
        {
            var friendship = await _context.FriendBoxes.FindAsync(messageSentRequest.FriendBoxId);

            friendship.UpdateTime = DateTime.UtcNow;

            var newMessage = new Message
            {
                ContentText = messageSentRequest.ContentText,
                SentDate = DateTime.UtcNow,
                FromUserId = messageSentRequest.FromUserId,
                ToUserId = messageSentRequest.ToUserId,
                Friendship = friendship
            };

            _context.Add(newMessage);
            await _context.SaveChangesAsync();

            await Clients.Group(messageSentRequest.ToUserId.ToString()).SendAsync("RecieveMessage", _mapper.Map<MessageSentResponse>(newMessage));
        }

    }
}
