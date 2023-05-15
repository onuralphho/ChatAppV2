



namespace ChatAppBackend.Controllers
{
    [Route("api/[controller]")]

    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {

        private readonly IUserService _userService;


        public UsersController(IUserService userService)
        {

            _userService = userService;

        }



        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult> Register(RegisterDto regUser)
        {
            await _userService.Register(regUser).ConfigureAwait(false);
            return NoContent();

        }

        [HttpPut("update")]
        public async Task<UserUpdateResponse> Update(UpdateUserDto updatedUser)
        {
            var response = new UserUpdateResponse { Detail = "update_user", SessionUser = await _userService.UpdateUser(updatedUser).ConfigureAwait(false) };
            return response;
        }

        [HttpPut("changepassword")]
        public async Task<UpdatePasswordResponse> ChangePassword(UpdatePasswordDto passwordDto)
        {

            return await _userService.UpdatePassword(passwordDto).ConfigureAwait(false); ;

        }


        [HttpPost("search")]
        public List<UserSearchResponse> SearchUsers(UserSearchRequest userSearch)
        {
            return _userService.SearchUser(userSearch);

        }

        [HttpPut("updatefeeling")]
        public async Task<UpdateUserFeelingDto> UpdateFeeling(UpdateUserFeelingDto userFeeling)
        {
            return await _userService.UpdateFeeling(userFeeling).ConfigureAwait(false);

        }
        


    }
}
