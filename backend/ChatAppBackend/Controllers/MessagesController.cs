


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
        public Task<List<MessageSentResponse>> Messages(int friendBoxId, [FromQuery] int skip = 0)
        {
            return _messageservice.GetMessages(friendBoxId,skip);
        }



        [HttpPost("addmessage")]
        public Task<MessageSentResponse> AddMessage(MessageSentRequest message)
        {

            return _messageservice.AddMessage(message);

        }

        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [HttpGet("read/{friendBoxId}")]
        public async Task<ActionResult> ReadMessages(int friendBoxId)
        {
            //Canlı mesaj okuma yapısı kurulunca düzenlenicek
            await _messageservice.ReadMessage(friendBoxId).ConfigureAwait(false);
            return NoContent();
        }





    }
}
