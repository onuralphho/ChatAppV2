using ChatAppBackend.Models.FriendBox.DTO;


namespace ChatAppBackend.Models.FriendBox.Response;
public class FriendBoxFriendsResponse
{
    public int Id { get; set; }
    public int FromUserId { get; set; }
    public int ToUserId { get; set; }
    public DateTime UpdateTime { get; set; }
    public bool Approved { get; set; }
    public int UnreadMessageCount { get; set; }
    public string LastMessage { get; set; }
    public string LastMessageFrom { get; set; }
    public FriendBoxUserDTO FromUser { get; set; }
    public FriendBoxUserDTO ToUser { get; set; }

}