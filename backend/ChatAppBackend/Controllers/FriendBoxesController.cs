using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatAppBackend.Context;
using Microsoft.AspNetCore.Authorization;
using ChatAppBackend.Models.FriendBox.Response;
using ChatAppBackend.Models.FriendBox.Request;
using ChatAppBackend.Services;

namespace ChatAppBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FriendBoxesController : Controller
    {
        private readonly PostgreSqlDbContext _context;
        private readonly IFriendBoxService _friendBoxService;

        public FriendBoxesController(PostgreSqlDbContext context,IFriendBoxService friendBoxService)
        {

            _context = context;
            _friendBoxService = friendBoxService;
        }

        [HttpPost("addfriend")]
        public async Task<ActionResult> AddFriend(FriendBoxAddRequest friendBox)
        {
            var friendShip = await _context.FriendBoxes.FirstOrDefaultAsync(f => (f.FromUserId == friendBox.FromId && f.ToUserId == friendBox.ToId)
                 || (f.FromUserId == friendBox.ToId && f.ToUserId == friendBox.FromId));


            if (friendShip != null)
            {
                return Ok(new { message = "Already your friend" });
            }

            return Ok(new
            {
                addedfriend = await _friendBoxService.AddFriend(friendBox),
                message = "Friend request sent",

            });
        }

        [HttpGet("friends")]
        public List<FriendBoxFriendsResponse> GetUserFriendships()
        {

            return _friendBoxService.GetFriends();
        }

        [HttpPut]
        [Route("approve/{friendBoxId}")]
        public  Task<FriendBoxFriendsResponse> Update(int friendBoxId)
        {
           return  _friendBoxService.ApproveFriend(friendBoxId);
            
        }


        [HttpDelete]
        [Route("delete/{friendBoxId}")]
        public async Task<ActionResult> Delete(int friendBoxId)
        {
            return Ok(new
            {
                message = await _friendBoxService.DeleteFriend(friendBoxId),
            });
        }
    }
}
