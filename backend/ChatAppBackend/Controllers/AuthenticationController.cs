using ChatAppBackend.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatAppBackend.Entities;
using ChatAppBackend.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using ChatAppBackend.Hubs;
using ChatAppBackend.Services;

namespace ChatAppBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AuthenticationController : ControllerBase 
    {

        private readonly PostgreSqlDbContext _context;
        private readonly JwtService _jwtService;
        private readonly IAuthenticationService _authenticationService;
        public AuthenticationController(PostgreSqlDbContext context, JwtService jwtService,IAuthenticationService authenticationService)
        {
            _context = context;
            _jwtService = jwtService;
            _authenticationService = authenticationService;
        }
  

        [AllowAnonymous]
        [HttpPost("login")]

        public async Task<ActionResult<TokenDto>> Login(AuthDto auth) // async kaldır test et !!!
        {

            var user = _context.Users.Where(x => x.Email == auth.Email).FirstOrDefault();

            if (user == null)
            {
                return BadRequest(new  { Message = "Invalid Credentials" });
            }
            if (!BCrypt.Net.BCrypt.Verify(auth.Password, user.Password))
            {
                return BadRequest(new  { Message = "Invalid Credentials" });
            }

            return Ok(_authenticationService.Login(user.Id));
        }

        [HttpGet("session")]
        public ActionResult Session()
        {
     
            return Ok(_authenticationService.GetSession());
        }

        [HttpGet("logout")]
        public ActionResult Logout()
        {
            
            return Ok(new
            {
                success =_authenticationService.LogOut(),
            });
        }


    }
}
