namespace ChatAppBackend.Core.Models.User.Request
{
    public class UpdateUserDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Picture { get; set; }
    }
}
