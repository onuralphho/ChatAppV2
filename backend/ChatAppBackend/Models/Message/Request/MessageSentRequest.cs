
namespace ChatAppBackend.Models.Message.Request
{
    public class MessageSentRequest
    {

        public string ContentText { get; set; }

        public int FromUserId { get; set; }

        public int ToUserId { get; set; }

        public int FriendBoxId { get; set; }

    }
}
