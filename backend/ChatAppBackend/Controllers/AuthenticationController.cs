using ChatAppBackend.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatAppBackend.Entities;
using ChatAppBackend.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace ChatAppBackend.Controllers
{
    [Route("api/")]
    [ApiController]
    [Authorize]
    public class AuthenticationController : ControllerBase
    {

        private readonly PostgreSqlDbContext _context;
        private readonly JwtService _jwtService;

        public AuthenticationController(PostgreSqlDbContext context,JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }
        public class Error
        {
            public string Message { get; set; }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<Auth>> PostUser(Auth auth)
        {
            var user = _context.Users.Where(x=>x.Email == auth.Email).FirstOrDefault();

            if (user == null)
            {
                return BadRequest(new Error { Message = "Invalid Credentials" });
            }
            if (!BCrypt.Net.BCrypt.Verify(auth.Password, user.Password))
            {
                return BadRequest(new Error { Message = "Invalid Credentials" });
            }

            var jwt = _jwtService.Generate(user.Id);

            Response.Cookies.Append("jwt", jwt,new CookieOptions //TODO: cookie'ye yazmadan yapalım.
            {
                HttpOnly = true,
            });

            return Ok(new //TODO: TokenResponse adında bir sınıf dönülebilir.
            {
                success = true
            });
        }

        [HttpGet("user")]
        public IActionResult User()
        {
            try
            {

            var jwt = Request.Cookies["jwt"];

            var token = _jwtService.Verify(jwt);

            int userId = int.Parse(token.Issuer);

            var user = _context.Users.Where(x => x.Id == userId).FirstOrDefault();

            return Ok(user);

            }catch (Exception ex)
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
