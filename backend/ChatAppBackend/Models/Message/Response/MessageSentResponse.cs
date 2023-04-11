﻿namespace ChatAppBackend.Models.Message.Response
{
    public class MessageSentResponse
    {
        
        public int Id { get; set; }
        public DateTime SentDate { get; set; } = DateTime.UtcNow;

        public string ContentText { get; set; }

        public int FromUserId { get; set; }

        public int ToUserId { get; set; }

               
    }
}