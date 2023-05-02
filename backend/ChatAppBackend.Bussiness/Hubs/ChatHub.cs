using AutoMapper;
using ChatAppBackend.Core.Models.FriendBox.Response;
using ChatAppBackend.Core.Models.Hub;
using ChatAppBackend.DataAccess.Context;
using ChatAppBackend.Core.Entities;
using ChatAppBackend.Core.Models.FriendBox.Request;
using ChatAppBackend.Core.Models.Message.Request;
using ChatAppBackend.Core.Models.Message.Response;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ChatAppBackend.Bussiness.Hubs
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

        public async Task FriendRequest(FriendBoxFriendsResponse friendBox)
        {

            await Clients.Group(friendBox.ToUserId.ToString()).SendAsync("RecieveFriend", friendBox);


        }

        public async Task ApproveFriend(FriendBoxFriendsResponse friendBox)
        {


            await Clients.Group(friendBox.FromUserId.ToString()).SendAsync("ApproveFriend", friendBox);

        }


        public async Task SendMessage(HubMessageSent hubMessageSent)
        {

            var friendshipdb = _context.FriendBoxes.Include(f => f.FromUser)
         .Include(f => f.ToUser).FirstOrDefault((f) => f.Id == hubMessageSent.FriendBoxId);

            friendshipdb.LastMessage = hubMessageSent.ContentText;
            friendshipdb.LastMessageFrom = hubMessageSent.FromUser.Name;

            await _context.SaveChangesAsync();

            var friendship = _mapper.Map<FriendBoxFriendsResponse>(friendshipdb);

            int unreadMessageCount = _context.Messages.Where((f) => f.Friendship.Id == hubMessageSent.FriendBoxId)
            .Count(m => m.ToUserId == hubMessageSent.ToUserId && !m.IsRead);

            var obj = new
            {
                hubMessageSent,
                friendship,
                unreadMessageCount
            };


            await Clients.Group(hubMessageSent.ToUserId.ToString()).SendAsync("RecieveMessage", obj);
        }

    }
}
