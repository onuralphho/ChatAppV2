namespace ChatAppBackend.Core.Models
{
    public class JwtOptions
    {

        public const string Jwt = "Jwt";
        public string Key { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
    }
}
