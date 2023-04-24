﻿using AutoMapper;
using ChatAppBackend.Context;
using ChatAppBackend.Dto;
using ChatAppBackend.Entities;
using ChatAppBackend.Models.User.Request;
using ChatAppBackend.Models.User.Response;


namespace ChatAppBackend.Services
{

    public interface IUserService
    {
        Task<string> Register(RegisterDto regUser);
        Task<SessionUserDto> UpdateUser(UpdateUserDto updatedUser);
        List<UserSearchResponse> SearchUser(UserSearchRequest userSearch);
    }
    public class UserService:IUserService
    {
        private readonly PostgreSqlDbContext _context;
        private readonly IMapper _mapper;

        public UserService(PostgreSqlDbContext context,IMapper mapper) {
        
            _context = context;
            _mapper = mapper;
            
        }

        async Task<string> IUserService.Register(RegisterDto regUser)
        {
            
            var reg_user = new User
            {
                Email = regUser.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(regUser.Password),
                Name = regUser.Name,
                CreatedTime = DateTime.UtcNow,
                UpdateTime = DateTime.UtcNow,
                Picture = regUser.Picture
            };



            _context.Users.Add(reg_user);
            await _context.SaveChangesAsync();

            return "Register Complete";
        }


        async Task<SessionUserDto> IUserService.UpdateUser(UpdateUserDto updatedUser)
        {
            var user = await _context.Users.FindAsync(updatedUser.Id);

            user.UpdateTime = DateTime.UtcNow;
            user.Name = updatedUser.Name;
            user.Picture = updatedUser.Picture;

            await _context.SaveChangesAsync();

            return _mapper.Map<SessionUserDto>(user);
        }
        List<UserSearchResponse> IUserService.SearchUser(UserSearchRequest userSearch)
        {

            var matchingUsers = _context.Users.Where(u => u.Name.Contains(userSearch.searchValue)).Select(u => new UserSearchResponse { Id = u.Id, Name = u.Name, Picture = u.Picture }).ToList();



            matchingUsers = matchingUsers.OrderByDescending(u => GetSimilarity(u.Name, userSearch.searchValue)).ToList();


            return matchingUsers.Select((matchingUser) => _mapper.Map<UserSearchResponse>(matchingUser)).ToList();
        }

        private static double GetSimilarity(string s1, string s2)
        {
            int n = s1.Length;
            int m = s2.Length;

            if (n == 0 || m == 0) return 0;

            int[,] d = new int[n + 1, m + 1];

            for (int i = 0; i <= n; i++)
            {
                d[i, 0] = i;
            }

            for (int j = 0; j <= m; j++)
            {
                d[0, j] = j;
            }

            for (int j = 1; j <= m; j++)
            {
                for (int i = 1; i <= n; i++)
                {
                    int cost = (s1[i - 1] == s2[j - 1]) ? 0 : 1;
                    d[i, j] = Math.Min(d[i - 1, j] + 1, Math.Min(d[i, j - 1] + 1, d[i - 1, j - 1] + cost));
                }
            }

            return 1 - (double)d[n, m] / Math.Max(n, m);
        }
    }
}