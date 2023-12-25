using AutoMapper;



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
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.UserId).ConfigureAwait(false);
        }

        public async Task FriendRequest(FriendBoxFriendsResponse friendBox)
        {

            await Clients.Group(friendBox.ToUserId.ToString()).SendAsync("RecieveFriend", friendBox).ConfigureAwait(false);


        }

        public async Task ApproveFriend(FriendBoxFriendsResponse friendBox)
        {


            await Clients.Group(friendBox.FromUserId.ToString()).SendAsync("ApproveFriend", friendBox).ConfigureAwait(false);

        }

        public async Task TypingStatus(TypingStatusDto typingStatus)
        {
            Console.WriteLine(typingStatus.IsTyping);
            await Clients.Group(typingStatus.ToUserId).SendAsync("RecieveTypingStatus", typingStatus).ConfigureAwait(false);

        }

        public async Task Test(string a)
        {
            await Clients.Group("1").SendAsync("RecieveTypingStatus", a).ConfigureAwait(false);

        }


        public async Task SendMessage(HubMessageSent hubMessageSent)
        {

            var friendshipdb = _context.FriendBoxes.Include(f => f.FromUser)
         .Include(f => f.ToUser).FirstOrDefault((f) => f.Id == hubMessageSent.FriendBoxId);

            if (hubMessageSent.ContentText.Length == 0)
            {
                friendshipdb.LastMessage = "image";
            }
            else
            {
                friendshipdb.LastMessage = hubMessageSent.ContentText;

            }
            friendshipdb.LastMessageFrom = hubMessageSent.FromUser.Name;

            await _context.SaveChangesAsync().ConfigureAwait(false);

            var friendship = _mapper.Map<FriendBoxFriendsResponse>(friendshipdb);

            int unreadMessageCount = _context.Messages.Where((f) => f.Friendship.Id == hubMessageSent.FriendBoxId)
            .Count(m => m.ToUserId == hubMessageSent.ToUserId && !m.IsRead);

            var obj = new
            {
                hubMessageSent,
                friendship,
                unreadMessageCount
            };


            await Clients.Group(hubMessageSent.ToUserId.ToString()).SendAsync("RecieveMessage", obj).ConfigureAwait(false);
        }

    }
}
