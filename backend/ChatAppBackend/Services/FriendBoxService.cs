using AutoMapper;
using ChatAppBackend.Context;
using ChatAppBackend.Entities;
using ChatAppBackend.Helpers;
using ChatAppBackend.Models.FriendBox.Request;
using ChatAppBackend.Models.FriendBox.Response;
using Microsoft.EntityFrameworkCore;


namespace ChatAppBackend.Services
{
    public interface IFriendBoxService
    {
        Task<FriendBoxFriendsResponse> AddFriend(FriendBoxAddRequest friendBox);
        List<FriendBoxFriendsResponse> GetFriends();
        Task<FriendBoxFriendsResponse> ApproveFriend(int friendBoxId);
        Task<string> DeleteFriend(int friendBoxId);
    }
    public class FriendBoxService:IFriendBoxService
    {
        private readonly PostgreSqlDbContext _context;
        private readonly JwtService _jwtService;
        private readonly IMapper _mapper;
        public FriendBoxService(PostgreSqlDbContext context,IMapper mapper,JwtService jwtService)
        {
            _context = context;
            _jwtService=jwtService;
            _mapper = mapper;
        }

        async Task<FriendBoxFriendsResponse> IFriendBoxService.AddFriend(FriendBoxAddRequest friendBox)
        {
            var user = await _context.Users.FindAsync(friendBox.FromId);
            var friend = await _context.Users.FindAsync(friendBox.ToId);



            var friendShip = new FriendBox
            {
                FromUser = user,
                ToUser = friend,
                UpdateTime = DateTime.UtcNow,
            };

            _context.FriendBoxes.Add(friendShip);
            await _context.SaveChangesAsync();

            return _mapper.Map<FriendBoxFriendsResponse>(friendShip);
        }

        

        List<FriendBoxFriendsResponse> IFriendBoxService.GetFriends()
        {
            int userId = _jwtService.UserId;
            var friendBoxes = _context.FriendBoxes
         .Include(f => f.FromUser)
         .Include(f => f.ToUser)
         .Where(f => f.FromUserId == userId || f.ToUserId == userId)
         .ToList();

            var result = new List<FriendBoxFriendsResponse>();

            foreach (var friendBox in friendBoxes)
            {
                int friendBoxId = friendBox.Id;

                int unreadMessageCount = _context.Messages
                    .Where(m => m.Friendship.Id == friendBoxId && m.ToUserId == userId && !m.IsRead)
                    .Count();

                var friendBoxResponse = _mapper.Map<FriendBoxFriendsResponse>(friendBox);
                friendBoxResponse.UnreadMessageCount = unreadMessageCount;
                result.Add(friendBoxResponse);
            }

            return result;
        }
        async Task<FriendBoxFriendsResponse> IFriendBoxService.ApproveFriend(int friendBoxId)
        {
            var friendbox = await _context.FriendBoxes
                .Include(f => f.FromUser)
                .Include(f => f.ToUser)
                .FirstOrDefaultAsync(f => f.Id == friendBoxId);


            if (friendbox == null)
            {
                return null;
            }

            friendbox.Approved = true;
            friendbox.UpdateTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return _mapper.Map<FriendBoxFriendsResponse>(friendbox);
        }

        async Task<string> IFriendBoxService.DeleteFriend(int friendBoxId)
        {
            var friendbox = await _context.FriendBoxes.FirstOrDefaultAsync(f => f.Id == friendBoxId);

            if (friendbox == null)
            {
                return "Something went wrong";
            }

            _context.FriendBoxes.Remove(friendbox);


            await _context.SaveChangesAsync();
            return "Friend Rejected";
        }
    }
}
