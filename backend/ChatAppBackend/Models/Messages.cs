using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ChatAppBackend.Entities
{
    public class Message
    {
        [Key]
        public int Id { get; set; }

        public DateTime SentDate { get; set; } = DateTime.UtcNow;

        public String FromUserId { get; set; }

        public String ToUserId { get; set; }

        public virtual User FromUser { get; set; }
        public virtual User ToUser { get; set; }

    }
}