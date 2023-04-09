using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ChatAppBackend.Context;
using ChatAppBackend.Entities;
using ChatAppBackend.Models.Message.Response;
using Microsoft.AspNetCore.Authorization;
using ChatAppBackend.Models.Message.Request;
using ChatAppBackend.Models.User.Response;

namespace ChatAppBackend.Controllers
{
    [Route("api/[controller]")]

    [ApiController]
    [Authorize]
    public class MessagesController : Controller
    {
        private readonly PostgreSqlDbContext _context;

        public MessagesController(PostgreSqlDbContext context)
        {
            _context = context;
        }

        [HttpGet("{friendBoxId}")]
        public ActionResult Messages(int friendBoxId)
        {
            var messages = _context.Messages.Where(u => u.Friendship.Id == friendBoxId).ToList();

            if (messages == null)
            {
                return BadRequest(new { error = "No friendship with this user!" });
            }
            return Ok(new
            {
                messages
            });
        }




        [HttpPost("addmessage")] //sent message yapılacak
        public async Task<MessageSentResponse> AddMessage(MessageSentRequest message)
        {
            var friendship = await _context.FriendBoxes.FindAsync(message.FriendBoxId);

            //if (friendship == null)
            //{
            //    return NotFound();
            //}


            var newMessage = new Message
            {
                ContentText = message.ContentText,
                SentDate = DateTime.UtcNow,
                FromUserId = message.FromUserId,
                ToUserId = message.ToUserId,
                Friendship = friendship

            };

           


            _context.Add(newMessage);
            await _context.SaveChangesAsync();

            var resMessage = new MessageSentResponse
            {
                Id = newMessage.Id,
                ContentText = message.ContentText,
                SentDate = DateTime.UtcNow,
                FromUserId = message.FromUserId,
                ToUserId = message.ToUserId,

            };

            return resMessage;
        }

        

    }
}
