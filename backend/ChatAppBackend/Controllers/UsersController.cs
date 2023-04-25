using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ChatAppBackend.Dto;
using ChatAppBackend.Models.User.Request;
using ChatAppBackend.Models.User.Response;
using AutoMapper;
using ChatAppBackend.Services;

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




        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult> Register(RegisterDto regUser)
        {
            if (await _userService.Register(regUser))
            {
                return Ok(new { success = "Register Complete" });
            }
            else
            {
                return BadRequest(new
                {
                    Message = "Email already exist"
                });
            }
        }

        [HttpPut("update")]
        public async Task<ActionResult> Update(UpdateUserDto updatedUser)
        {
            return Ok(new { session = await _userService.UpdateUser(updatedUser), success = "User updated successfully" });
        }


        [HttpPost("search")]
        public List<UserSearchResponse> SearchUsers(UserSearchRequest userSearch)
        {
            return _userService.SearchUser(userSearch);

        }



    }
}
