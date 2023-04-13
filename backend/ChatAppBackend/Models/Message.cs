using System;
using System.ComponentModel.DataAnnotations;

namespace ChatAppBackend.Entities
{
    public class Message
    {
        [Key]
        public int Id { get; set; }

        public DateTime SentDate { get; set; } = DateTime.UtcNow;

        public string ContentText { get; set; }

        public int FromUserId { get; set; }

        public int ToUserId { get; set; }

        public virtual FriendBox Friendship { get; set; }



    }
}