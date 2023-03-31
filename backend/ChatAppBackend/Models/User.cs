using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ChatAppBackend.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public DateTime CreatedTime { get; set; } = DateTime.Now;

        public DateTime? UpdateTime { get; set; }

        public string Email { get; set; }

        
        public string Password { get; set; }

        
        public string Name { get; set; }
    }
}