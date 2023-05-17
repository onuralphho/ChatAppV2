

namespace ChatAppBackend.Core.Models.User.Request
{
    public class UpdatePasswordDto
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
