using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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
        private readonly IConfiguration configuration;

        public UsersController(IUserService userService, IConfiguration configuration)
        {

            _userService = userService;
            this.configuration = configuration;
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
        public async Task<UserUpdateResponse> Update(UpdateUserDto updatedUser)
        {
            var response = new UserUpdateResponse { Message = "User updated", SessionUser = await _userService.UpdateUser(updatedUser) };
            return response;
        }


        [HttpPost("search")]
        public List<UserSearchResponse> SearchUsers(UserSearchRequest userSearch)
        {
            return _userService.SearchUser(userSearch);

        }

        [HttpGet("GetConnection")]
        [AllowAnonymous]
        public ActionResult GetConnection()
        {
            var con = this.configuration.GetConnectionString("DefaultConnection");
            return Ok(new
            {
                connectionString = con
            });
        }
    }
}
