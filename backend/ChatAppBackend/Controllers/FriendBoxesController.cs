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
        private readonly IFriendBoxService _friendBoxService;

        public FriendBoxesController(IFriendBoxService friendBoxService)
        {

         
            _friendBoxService = friendBoxService;
        }

        [HttpPost("addfriend")]
        public async Task<ActionResult> AddFriend(FriendBoxAddRequest friendBox)
        {
            var FriendBoxData = await _friendBoxService.AddFriend(friendBox);

            if (FriendBoxData == null)
            {
                return Ok(new { Message = "Already your friend" });
                

            }
            else
            {
                return Ok(new
                {
                    addedfriend = FriendBoxData,
                    message = "Friend request sent",

                });
            }

            
        }

        [HttpGet("friends")]
        public List<FriendBoxFriendsResponse> GetUserFriendships()
        {

            return _friendBoxService.GetFriends();
        }

        [HttpPut]
        [Route("approve/{friendBoxId}")]
        public Task<FriendBoxFriendsResponse> Update(int friendBoxId)
        {
            return _friendBoxService.ApproveFriend(friendBoxId);

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
