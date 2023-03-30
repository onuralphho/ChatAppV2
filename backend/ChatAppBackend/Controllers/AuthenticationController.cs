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
            var tmp = _context.Users.Where(x=>x.Email == auth.Email && x.Password == auth.Password);

            if (tmp != null)
            {
                return Ok(tmp);

            }


            return BadRequest(new Error { Message = "Wrong credential" });


            
        }



    }
}
