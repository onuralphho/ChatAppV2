using ChatAppBackend.Models.User.Request;

namespace ChatAppBackend.Models.Message.Response
{
    public class MessageSentResponse
    {
        
        public int Id { get; set; }
        public DateTime SentDate { get; set; } = DateTime.UtcNow;

        public string ContentText { get; set; }

        public string ContentImageUrl { get; set; }

        public int FromUserId { get; set; }

        public int ToUserId { get; set; }

        public int FriendBoxId { get; set; }
        public bool IsRead { get; set; } = false;

        public bool IsDeleted { get; set; } = false;
        public UpdateUserDto FromUser { get; set; }
               
    }
}
