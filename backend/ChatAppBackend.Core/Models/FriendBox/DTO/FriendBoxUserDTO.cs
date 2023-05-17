namespace ChatAppBackend.Core.Models.FriendBox.DTO
{
    public class FriendBoxUserDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Picture { get; set; }
        public string Feeling { get; set; }
        public int UnreadCount { get; set; } = 0;
    }
}