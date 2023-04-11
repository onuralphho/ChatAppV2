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
        private static IDictionary<string, List<string>> _connections = new Dictionary<string, List<string>>();
        public readonly IMapper _mapper;


        public ChatHub(PostgreSqlDbContext context, IMapper mapper, IDictionary<string, List<string>> connections)
        {
            _context = context;
            _mapper = mapper;
            _connections = connections;
        }

        public async Task JoinRoom(UserConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.UserId);
            if (!_connections.ContainsKey(userConnection.UserId)) _connections.Add(userConnection.UserId, new List<string>());

            _connections[userConnection.UserId].Add(Context.ConnectionId);
            //await Clients.Group(userConnection.UserId).SendAsync("RecieveMessage", _connections[Context.ConnectionId].UserId);

        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            return base.OnDisconnectedAsync(exception);
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

            if (_connections.ContainsKey(messageSentRequest.ToUserId.ToString()))
            {
            newMessage.ContentText = newMessage.ContentText + " -- connectionId ile işlem";

                await Clients.Clients(_connections[messageSentRequest.ToUserId.ToString()]).SendAsync("RecieveMessage", _mapper.Map<MessageSentResponse>(newMessage));
            }

        }

    }
}
