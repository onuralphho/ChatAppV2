using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ChatAppBackend.Context;
using ChatAppBackend.Entities;
using Microsoft.AspNetCore.Authorization;
using ChatAppBackend.Models.FriendBox.Response;
using ChatAppBackend.Models.FriendBox.Request;
using ChatAppBackend.Helpers;
using ChatAppBackend.Models.FriendBox.DTO;
using AutoMapper;

namespace ChatAppBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FriendBoxesController : Controller
    {
        private readonly PostgreSqlDbContext _context;
        private readonly JwtService _jwtService;
        private readonly IMapper _mapper;

        public FriendBoxesController(PostgreSqlDbContext context, JwtService jwtService,IMapper mapper)
        {

            _context = context;
            _jwtService = jwtService;
            _mapper = mapper;
        }

        [HttpPost("addfriend")]
        public async Task<ActionResult> AddFriend(FriendBoxAddRequest friendBox)
        {

            var user = await _context.Users.FindAsync(friendBox.FromId);
            var friend = await _context.Users.FindAsync(friendBox.ToId);

            var friendShip = await _context.FriendBoxes.FirstOrDefaultAsync(f => (f.FromUserId == friendBox.FromId && f.ToUserId == friendBox.ToId)
                                  || (f.FromUserId == friendBox.ToId && f.ToUserId == friendBox.FromId));


            if (friendShip != null)
            {
                return Ok(new { message = "Already your friend" });
            }



            friendShip = new FriendBox
            {
                FromUser = user,
                ToUser = friend,
                UpdateTime = DateTime.UtcNow,
            };

            _context.FriendBoxes.Add(friendShip);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                addedfriend = _mapper.Map<FriendBoxFriendsResponse>(friendShip), //DONE
                message = "Friend request sent",

            });

        }

        [HttpGet("friends")]
        public List<FriendBoxFriendsResponse> GetUserFriendships()
        {
            //TODO:sadece karşı taraf dönülecek 
            int userId = _jwtService.UserId;
            var friendBoxes = _context.FriendBoxes
         .Include(f => f.FromUser)
         .Include(f => f.ToUser)
         .Where(f => f.FromUserId == userId || f.ToUserId == userId)
         .ToList();

   
            return friendBoxes.Select((friendBox)=> _mapper.Map<FriendBoxFriendsResponse>(friendBox)).ToList(); //DONE
        }

        [HttpPut]
        [Route("approve/{friendBoxId}")]
        public async Task<ActionResult> Update(int friendBoxId)
        {
            Console.WriteLine(friendBoxId);
            var friendbox = await _context.FriendBoxes.FirstOrDefaultAsync(f => f.Id == friendBoxId);


            if (friendbox == null)
            {
                return NotFound();
            }

            friendbox.Approved = true;
            friendbox.UpdateTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new
            {
                message = "You have a new friend!"
            });
        }
        [HttpDelete]
        [Route("delete/{friendBoxId}")]
        public async Task<ActionResult> Delete(int friendBoxId)
        {
            var friendbox = await _context.FriendBoxes.FirstOrDefaultAsync(f => f.Id == friendBoxId);


            if (friendbox == null)
            {
                return NotFound();
            }

            _context.FriendBoxes.Remove(friendbox);


            await _context.SaveChangesAsync();
            return Ok(new
            {
                message = "Friend rejected"
            });
        }
    }
}
