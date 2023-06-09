﻿

namespace ChatAppBackend.Core.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
        public DateTime UpdateTime { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Picture { get; set; }
        public string Feeling { get; set; }
    }
}