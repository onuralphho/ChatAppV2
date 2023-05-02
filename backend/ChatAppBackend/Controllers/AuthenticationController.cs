using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatAppBackend.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using ChatAppBackend.Bussiness.Hubs;
using ChatAppBackend.Core.Exceptions;
using ChatAppBackend.Bussiness.Services;
using ChatAppBackend.DataAccess.Context;

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
        public AuthenticationController(PostgreSqlDbContext context, JwtService jwtService, IAuthenticationService authenticationService)
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
                
                //var options = new CookieOptions
                //{
                //    HttpOnly = true,
                //    Expires = DateTime.Now.AddDays(1),
                //    SameSite = SameSiteMode.Strict,
                //    Path = "/"
                //};

                //HttpContext.Response.Cookies.Append("jwt", token.TokenValue, options);

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
