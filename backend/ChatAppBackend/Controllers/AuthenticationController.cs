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

        public TokenDto Login(AuthDto auth) 
        {
            var token = _authenticationService.Login(auth);

            if (token == null)
            {
                throw new BadRequestException("Invalid Credentials");    
            }
            else
            {
                return token;
            }
        }

        [HttpGet("session")]
        public SessionUserDto Session()
        {
     
            return _authenticationService.GetSession();
        }

        [HttpGet("logout")]
        public ActionResult Logout()
        {

            //Cookie silme işlemi çalışmıyor
            
            //_httpContextAccessor.HttpContext.Response.Cookies.Delete("jwt");
            //_httpContextAccessor.HttpContext.Response.Cookies.Append("jwt", "", new CookieOptions
            //{
            //    Expires = DateTime.Now.AddDays(-1)
            //});

            return Ok();
        }


    }
}
