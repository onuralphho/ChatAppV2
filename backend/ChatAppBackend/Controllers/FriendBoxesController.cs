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

namespace ChatAppBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FriendBoxesController : Controller
    {
        private readonly PostgreSqlDbContext _context;
        private readonly JwtService _jwtService;
        public FriendBoxesController(PostgreSqlDbContext context, JwtService jwtService)
        {

            _context = context;
            _jwtService = jwtService;
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
                return Ok(new { message = "Both of you already friend" });
            }


            // COMMENT: Burada yeni oluşturduğum FriendBox objesindeki FromUser ve ToUsera FriendBoxFriendsResponse'da
            //          özelleştirdiğim  objeleri veremiyorum çünkü User objesi referanslılar nasıl çözerim

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
                addedfriend = friendShip, // friend için bir response nesnesi oluşturulabilir.!!!
                message = "Friend Added",

            });

        }

        [HttpGet("friends")]
        public List<FriendBox> GetUserFriendships()
        {
            int userId = _jwtService.UserId;
            return _context.FriendBoxes
                .Include(f => f.FromUser)
                .Include(f => f.ToUser)
                .Where(f => f.FromUserId == userId || f.ToUserId == userId)
                .ToList();
        }
    }
}
