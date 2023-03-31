using ChatAppBackend.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatAppBackend.Entities;

namespace ChatAppBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {

        private readonly PostgreSqlDbContext _context;

        public AuthenticationController(PostgreSqlDbContext context)
        {
            _context = context;
        }
        public class Error
        {
            public string Message { get; set; }
        }

        [HttpPost]
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

            return Ok(user);
        }



    }
}
