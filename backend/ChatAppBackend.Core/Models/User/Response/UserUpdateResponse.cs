using System.Security.Policy;

namespace ChatAppBackend.Core.Models.User.Response
{
    public class UserUpdateResponse
    {
        public string Detail { get; set; }

        public SessionUserDto SessionUser { get; set; }

    }
}
