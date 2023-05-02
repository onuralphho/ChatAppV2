using System;
using System.ComponentModel.DataAnnotations;

namespace ChatAppBackend.Core.Entities
{
    public class Message
    {
        [Key]
        public int Id { get; set; }

        public DateTime SentDate { get; set; } = DateTime.UtcNow;

        public string ContentText { get; set; }

        public string ContentImageUrl { get; set; }

        public int FromUserId { get; set; }

        public int ToUserId { get; set; }

        public bool IsRead { get; set; } = false;

        public bool IsDeleted { get; set; } = false;

        public virtual FriendBox Friendship { get; set; }



    }
}