using AutoMapper;
using ChatAppBackend.Core.Models.User.Request;
using ChatAppBackend.Core.Models.User.Response;
using ChatAppBackend.DataAccess.Context;
using ChatAppBackend.Entities;
using ChatAppBackend.Exceptions;


namespace ChatAppBackend.Bussiness.Services
{

    public interface IUserService
    {
        Task Register(RegisterDto regUser);
        Task<SessionUserDto> UpdateUser(UpdateUserDto updatedUser);
        List<UserSearchResponse> SearchUser(UserSearchRequest userSearch);
    }
    public class UserService : IUserService
    {
        private readonly PostgreSqlDbContext _context;
        private readonly IMapper _mapper;

        public UserService(PostgreSqlDbContext context, IMapper mapper)
        {

            _context = context;
            _mapper = mapper;

        }

        public async Task Register(RegisterDto regUser)
        {
            var tmp = _context.Users.Where(x => x.Email == regUser.Email).FirstOrDefault();
            if (tmp != null)
            {
                throw new BadRequestException("Email already exist");

            }
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


        }


        public async Task<SessionUserDto> UpdateUser(UpdateUserDto updatedUser)
        {
            var user = await _context.Users.FindAsync(updatedUser.Id);
            user.UpdateTime = DateTime.UtcNow;
            user.Name = updatedUser.Name;
            user.Picture = updatedUser.Picture;

            await _context.SaveChangesAsync();

            return _mapper.Map<SessionUserDto>(user);
        }


        public List<UserSearchResponse> SearchUser(UserSearchRequest userSearch)
        {

            var matchingUsers = _context.Users.Where(u => u.Name.Contains(userSearch.SearchValue)).Select(u => new UserSearchResponse { Id = u.Id, Name = u.Name, Picture = u.Picture }).ToList();



            matchingUsers = matchingUsers.OrderByDescending(u => GetSimilarity(u.Name, userSearch.SearchValue)).ToList();


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
                    int cost = s1[i - 1] == s2[j - 1] ? 0 : 1;
                    d[i, j] = Math.Min(d[i - 1, j] + 1, Math.Min(d[i, j - 1] + 1, d[i - 1, j - 1] + cost));
                }
            }

            return 1 - (double)d[n, m] / Math.Max(n, m);
        }
    }
}
