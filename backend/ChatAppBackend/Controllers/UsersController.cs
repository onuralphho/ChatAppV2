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
using AutoMapper;
using ChatAppBackend.Services;

namespace ChatAppBackend.Controllers
{
    [Route("api/[controller]")]

    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly PostgreSqlDbContext _context;

        private readonly IMapper _mapper;

        private readonly IUserService _userService;

        public UsersController(PostgreSqlDbContext context, IMapper mapper,IUserService userService)
        {

            _context = context;
            _mapper = mapper;
            _userService = userService;
        }




        [HttpPost("register")]
        [AllowAnonymous]
        public ActionResult Register(RegisterDto regUser)
        {

            var tmp = _context.Users.Where(x => x.Email == regUser.Email).FirstOrDefault();
            if (tmp != null)
            {

                return BadRequest(new
                {
                    Message= "Email already exist"
                });
            }

            return Ok(new
            {
                success = _userService.Register(regUser)
            });


        }

        [HttpPut("update")]
        public async Task<ActionResult> Update(UpdateUserDto updatedUser)
        {
            return Ok(new { session = await _userService.UpdateUser(updatedUser), success = "User updated successfully" });
        }


        [HttpPost("search")]
        public List<UserSearchResponse> SearchUsers(UserSearchRequest userSearch)
        {
            return _userService.SearchUser(userSearch);

        }

        

    }
}
