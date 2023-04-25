using Microsoft.AspNetCore.Mvc;
using ChatAppBackend.Models.Message.Response;
using Microsoft.AspNetCore.Authorization;
using ChatAppBackend.Models.Message.Request;

using ChatAppBackend.Services;

namespace ChatAppBackend.Controllers
{
    [Route("api/[controller]")]

    [ApiController]
    [Authorize]
    public class MessagesController : Controller
    {

        public readonly IMessageService _messageservice;

        public MessagesController(IMessageService messageService)
        {


            _messageservice = messageService;
        }

        [HttpGet("{friendBoxId}")]
        public Task<List<MessageSentResponse>> Messages(int friendBoxId)
        {
            return _messageservice.GetMessages(friendBoxId);
        }



        [HttpPost("addmessage")]
        public Task<MessageSentResponse> AddMessage(MessageSentRequest message)
        {

            return _messageservice.AddMessage(message);

        }

        [HttpGet("read/{friendBoxId}")]
        public async Task<ActionResult> ReadMessages(int friendBoxId)
        {

            await _messageservice.ReadMessage(friendBoxId);

            return Ok(new
            {
                message = "success"
            });
        }





    }
}
