﻿using ChatAppBackend.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatAppBackend.Entities;
using ChatAppBackend.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using ChatAppBackend.Hubs;

namespace ChatAppBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AuthenticationController : ControllerBase 
    {

        private readonly PostgreSqlDbContext _context;
        private readonly JwtService _jwtService;
        private readonly IHubContext<ChatHub> _chathub;
        //
        public AuthenticationController(PostgreSqlDbContext context, JwtService jwtService, IHubContext<ChatHub> chathub)
        {
            _context = context;
            _jwtService = jwtService;
            _chathub = chathub;

        }
        public class Error
        {
            public string Message { get; set; }
        }


        [AllowAnonymous]
        [HttpPost("login")]

        public async Task<ActionResult<TokenDto>> Login(AuthDto auth) // async kaldır test et !!!
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


            return Ok(new TokenDto //mapper kullanılması gerekir mi Fatih beye sorulacak
            {
                TokenValue = jwt
            });
        }

        [HttpGet("session")]
        public IActionResult Session()
        {


            int userId = _jwtService.UserId;



            var user = _context.Users.Where(x => x.Id == userId).FirstOrDefault();

            var session = new SessionUserDto { Id = user.Id, Email = user.Email, Name = user.Name, Picture = user.Picture, UpdateTime = user.UpdateTime };

            
            return Ok(session);



        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            //hub üzerinden grup silinecek !!!
            return Ok(new
            {
                success = true
            });
        }





    }
}
