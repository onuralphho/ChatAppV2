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
using AutoMapper;
using ChatAppBackend.Dto;

namespace ChatAppBackend.Controllers
{
    [Route("api/[controller]")]

    [ApiController]
    [Authorize]
    public class MessagesController : Controller
    {
        private readonly PostgreSqlDbContext _context;

        public readonly IMapper _mapper;


        public MessagesController(PostgreSqlDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("{friendBoxId}")]
        public async Task<List<MessageSentResponse>> Messages(int friendBoxId)
        {
            var messages = await _context.Messages
                .Include(m => m.Friendship)
                .Where(m => m.Friendship.Id == friendBoxId)
                .ToListAsync();

            return messages.Select((message) =>
            {
                var messageSentResponse = _mapper.Map<MessageSentResponse>(message);
                messageSentResponse.FriendBoxId = message.Friendship.Id;
                return messageSentResponse;
            }).ToList();
        }



        [HttpPost("addmessage")] //sent message yapılacak
        public async Task<MessageSentResponse> AddMessage(MessageSentRequest message)
        {
            var friendship = await _context.FriendBoxes.FindAsync(message.FriendBoxId);

            friendship.UpdateTime = DateTime.UtcNow;

            var newMessage = new Message
            {
                ContentText = message.ContentText,
                SentDate = DateTime.UtcNow,
                FromUserId = message.FromUserId,
                ToUserId = message.ToUserId,
                Friendship = friendship,

            };


            _context.Add(newMessage);
            await _context.SaveChangesAsync();



            var resMessage = _mapper.Map<MessageSentResponse>(newMessage);
            resMessage.FriendBoxId = message.FriendBoxId;
            resMessage.FromUser = message.FromUser;

            return resMessage;





            //DONE
        }



    }
}
