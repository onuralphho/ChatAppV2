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
using ChatAppBackend.Dto;

namespace ChatAppBackend.Controllers
{
    [Route("api/[controller]")]

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


        // POST: api/register

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult> Register(RegisterDto regUser)
        {


            var tmp = _context.Users.Where(x => x.Email == regUser.Email).FirstOrDefault();
            if (tmp != null)
            {
                var error = new Error { Message = "Email already exists" };
                return BadRequest(error);
            }



            var reg_user = new User
            {
                Email = regUser.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(regUser.Password),
                Name = regUser.Name,
                CreatedTime = DateTime.UtcNow,
                UpdateTime = DateTime.UtcNow,
                Picture = regUser.Picture
            };



            _context.Users.Add(reg_user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = "Registeration Complete"
            });
        }

        [HttpPut("update")]
        public async Task<ActionResult> Update(UpdateUserDto updatedUser)
        {
            try
            {
                var user = await _context.Users.FindAsync(updatedUser.Id);

                if (user == null)
                {
                    return NotFound("User not found");
                }

                user.UpdateTime = DateTime.UtcNow;
                user.Name = updatedUser.Name;
                user.Picture = updatedUser.Picture;

                await _context.SaveChangesAsync();
                var session = new SessionUserDto { Id = user.Id, Email = user.Email, Name = user.Name, Picture = user.Picture, UpdateTime = DateTime.UtcNow };

                return Ok(new { session, success = "User updated successfully" });

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while updating the user: {ex.Message}");
            }
        }

    }
}
