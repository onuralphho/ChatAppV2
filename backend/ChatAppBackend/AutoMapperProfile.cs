using AutoMapper;
using ChatAppBackend.Entities;
using ChatAppBackend.Models.FriendBox.DTO;
using ChatAppBackend.Models.FriendBox.Response;
using ChatAppBackend.Models.Message.Response;

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
