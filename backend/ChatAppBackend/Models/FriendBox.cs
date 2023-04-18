using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ChatAppBackend.Entities
{
    public class FriendBox
    {
        [Key]
        public int Id { get; set; }
        public int FromUserId { get; set; }
        public int ToUserId { get; set; }
        public DateTime UpdateTime { get; set; }
        public bool Approved {get;set;}
        public string LastMessage { get; set; }
        public string LastMessageFrom { get; set; }
        public virtual User FromUser { get; set; }
        public virtual User ToUser { get; set; }



    }
}