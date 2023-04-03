using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatAppBackend.Context;
using ChatAppBackend.Entities;
using Newtonsoft.Json;
using Microsoft.CodeAnalysis.VisualBasic.Syntax;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;

namespace ChatAppBackend.Controllers
{
    [Route("api/")] //TODO:  [Route("api/[controller]")] olması lazım
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly PostgreSqlDbContext _context;

        public UsersController(PostgreSqlDbContext context)
        {
            _context = context;
        }

        public class Error
        {
            public string Message { get; set; }
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            if (_context.Users == null) //TODO: _context.Users == null böyle bir kontorle gerek yok.
            {
                return NotFound();
            }
            return await _context.Users.ToListAsync(); //TODO: Database nesneleri api'den dönmeyelim
        }



        // POST: api/register

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> PostUser(User user) //TODO: HttpPost name ve metod adı aynı olmalıdır.
        {

            if (_context.Users == null)
            {
                return Problem("Entity set 'PostgreSqlDbContext.Users'  is null.");
            }
            var tmp = _context.Users.Where(x => x.Email == user.Email).FirstOrDefault();
            if (tmp != null)
            {
                var error = new Error { Message = "Email already exists" };
                return BadRequest(error);
            }



            var reg_user = new User
            {
                Email
            = user.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(user.Password),
                Name = user.Name,
                CreatedTime = user.CreatedTime,
                UpdateTime = user.UpdateTime
            };



            _context.Users.Add(reg_user);
            await _context.SaveChangesAsync();

            return Ok(reg_user);
        }


    }
}
