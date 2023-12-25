
namespace ChatAppBackend.Core.Models.Hub
{
    public class TypingStatusDto
    {
        public string ToUserId { get; set; }
        public int FromUserId { get; set; }
        public bool IsTyping { get; set; }

    }
}
