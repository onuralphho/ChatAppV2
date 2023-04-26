using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ChatAppBackend.Dto;
using ChatAppBackend.Models.User.Request;
using ChatAppBackend.Models.User.Response;
using AutoMapper;
using ChatAppBackend.Services;
using System.Net;

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
            await _userService.Register(regUser);
            return NoContent();
            
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
