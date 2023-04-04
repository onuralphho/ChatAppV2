using ChatAppBackend.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatAppBackend.Entities;
using ChatAppBackend.Helpers;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
namespace ChatAppBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AuthenticationController : ControllerBase
    {

        private readonly PostgreSqlDbContext _context;
        private readonly JwtService _jwtService;

        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthenticationController(PostgreSqlDbContext context, JwtService jwtService,IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
            _jwtService = jwtService;
        }
        public class Error
        {
            public string Message { get; set; }
        }



        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<Auth>> Login(Auth auth)
        {
            var user = _context.Users.Where(x => x.Email == auth.Email).FirstOrDefault();

            if (user == null)
            {
                return BadRequest(new Error { Message = "Invalid Credentials" });
            }
            if (!BCrypt.Net.BCrypt.Verify(auth.Password, user.Password))
            {
                return BadRequest(new Error { Message = "Invalid Credentials" });
            }

            var jwt = _jwtService.Generate(user.Id);


            return Ok(new Token
            {
                TokenValue = jwt
            });
        }

        [HttpPost("user")]
        public IActionResult User(Token TokenValue)  //TODO: Claim'den alınacak
        {
            try
            {
                var Id = _httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;


                int userId = int.Parse(Id);//TODO:Jwt oturum açan kullanıcı alma araştır

                var user = _context.Users.Where(x => x.Id == userId).FirstOrDefault();

                var session = new SessionUser { Email = user.Email, Name = user.Name, Picture = user.Picture };

                return Ok(session);

            }
            catch (Exception ex)
            {
                return Unauthorized();
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok(new
            {
                success = true
            });
        }





    }
}
