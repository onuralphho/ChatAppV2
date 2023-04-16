﻿using AutoMapper;
using ChatAppBackend.Context;
using ChatAppBackend.Entities;
using ChatAppBackend.Models;
using ChatAppBackend.Models.FriendBox.Response;
using ChatAppBackend.Models.Hub;
using ChatAppBackend.Models.Message.Request;
using ChatAppBackend.Models.Message.Response;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ChatAppBackend.Hubs
{
    public class ChatHub : Hub
    {
        private readonly PostgreSqlDbContext _context;
        public readonly IMapper _mapper;


        public ChatHub(PostgreSqlDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task JoinRoom(UserConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.UserId);
        }


        public async Task SendMessage(HubMessageSent hubMessageSent)
        {

            var friendshipdb = await _context.FriendBoxes.FindAsync(hubMessageSent.FriendBoxId);

            var friendship = _mapper.Map<FriendBoxFriendsResponse>(friendshipdb);


            var obj = new
            {
                hubMessageSent,
                friendship
            };


            await Clients.Group(hubMessageSent.ToUserId.ToString()).SendAsync("RecieveMessage", obj);
        }

    }
}
