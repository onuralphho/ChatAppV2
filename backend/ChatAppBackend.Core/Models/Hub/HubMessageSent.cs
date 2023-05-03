using ChatAppBackend.Core.Models.User.Request;

namespace ChatAppBackend.Core.Models.Hub
{
    public class HubMessageSent
    {
        public int Id { get; set; }
        public string ContentText { get; set; }

        public string ContentImageUrl { get; set; }
        public int FromUserId { get; set; }

        public int ToUserId { get; set; }

        public int FriendBoxId { get; set; }

        public DateTime SentDate { get; set; } = DateTime.UtcNow;

        public UpdateUserDto FromUser { get; set; }

        public string AnimationType { get; set; }
    }
}
