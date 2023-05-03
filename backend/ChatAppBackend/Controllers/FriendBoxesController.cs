

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
        public async Task<FriendBoxAddResponse> AddFriend(FriendBoxAddRequest friendBox)
        {
            var FriendBoxData = await _friendBoxService.AddFriend(friendBox);
            if (FriendBoxData == null)
            {
                throw new BadRequestException("Already your friend");
            }
            else
            {
                var Response = new FriendBoxAddResponse { Friend = FriendBoxData, Message = "Friend request sent" };
                return Response;
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
        public async Task<FriendBoxDeleteResponse> Delete(int friendBoxId)
        {
            var Response = new FriendBoxDeleteResponse { FriendBoxId = await _friendBoxService.DeleteFriend(friendBoxId) };
            return Response;
            
           
        }
    }
}
