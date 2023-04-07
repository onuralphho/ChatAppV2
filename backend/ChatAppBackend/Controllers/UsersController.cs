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
using ChatAppBackend.Models.User.Request;
using ChatAppBackend.Models.User.Response;

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

        [HttpPost("search")]
        [AllowAnonymous] //Performansa etkisine göre Authorize yapılabilir
        public List<UserSearchResponse> SearchUsers(UserSearchRequest userSearch)
        {
            List<UserSearchResponse> result = new List<UserSearchResponse>();


            var matchingUsers = _context.Users.Where(u => u.Name.Contains(userSearch.searchValue)).Select(u => new UserSearchResponse { Id = u.Id, Name = u.Name ,Picture=u.Picture}).ToList();


            
            //matchingUsers = matchingUsers.OrderBy(u => GetSimilarity(u.Name, searchText)).ToList();



            result.AddRange(matchingUsers);

            return result;
        }
        
        //private double GetSimilarity(string s1, string s2)
        //{
        //    int n = s1.Length;
        //    int m = s2.Length;

        //    if (n == 0 || m == 0) return 0;

        //    int[,] d = new int[n + 1, m + 1];

        //    for (int i = 0; i <= n; i++)
        //    {
        //        d[i, 0] = i;
        //    }

        //    for (int j = 0; j <= m; j++)
        //    {
        //        d[0, j] = j;
        //    }

        //    for (int j = 1; j <= m; j++)
        //    {
        //        for (int i = 1; i <= n; i++)
        //        {
        //            int cost = (s1[i - 1] == s2[j - 1]) ? 0 : 1;
        //            d[i, j] = Math.Min(d[i - 1, j] + 1, Math.Min(d[i, j - 1] + 1, d[i - 1, j - 1] + cost));
        //        }
        //    }

        //    return 1 - (double)d[n, m] / Math.Max(n, m);
        //}

    }
}
