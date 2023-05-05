using AutoMapper;
using ChatAppBackend.Core.Entities;
using ChatAppBackend.Core.Models.FriendBox.DTO;
using ChatAppBackend.Core.Models.FriendBox.Response;
using ChatAppBackend.Core.Models.Message.Response;

namespace ChatAppBackend
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile() {
            CreateMap<User,SessionUserDto>().ReverseMap();
            CreateMap<FriendBox, FriendBoxFriendsResponse>().ReverseMap();
            CreateMap<FriendBoxUserDTO, User>().ReverseMap();
            CreateMap<Message, MessageSentResponse>();
        }
    }
}
