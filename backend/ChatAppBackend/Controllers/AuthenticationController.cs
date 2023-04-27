using ChatAppBackend.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatAppBackend.Entities;
using ChatAppBackend.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using ChatAppBackend.Hubs;
using ChatAppBackend.Services;
using ChatAppBackend.Exceptions;

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

        public ActionResult<TokenDto> Login(AuthDto auth) 
        {
            var token = _authenticationService.Login(auth);

            //return token == null ? throw new Exception("Token cannot be generated.") :Ok(token) ; 
            if (token == null)
            {
                throw new BadRequestException("Invalid Credentials");
                //return Unauthorized(new { Message = "Invalid Credentials" });
            }
            else
            {
                return Ok(token);
            }
        }

        [HttpGet("session")]
        public ActionResult<SessionUserDto> Session()
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
