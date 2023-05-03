﻿using Microsoft.AspNetCore.Http;



namespace ChatAppBackend.Bussiness.Services
{
    public interface IAuthenticationService
    {
        TokenDto Login(AuthDto auth);
        SessionUserDto GetSession();

    }
    public class AuthenticationService : IAuthenticationService
    {
        private readonly PostgreSqlDbContext _context;
        private readonly JwtService _jwtService;
      

        public AuthenticationService(PostgreSqlDbContext context, JwtService jwtService, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _jwtService = jwtService;
          
        }

        public TokenDto Login(AuthDto auth)
        {
            var user = _context.Users.Where(x => x.Email == auth.Email).FirstOrDefault();

            if (user == null || !BCrypt.Net.BCrypt.Verify(auth.Password, user.Password))
            {
                return null;
            }
            else
            {
                var jwt = _jwtService.Generate(user.Id);

                var token = new TokenDto { TokenValue = jwt };

                return token;
            }


        }
        public SessionUserDto GetSession()
        {

            int userId = _jwtService.UserId;

            var user = _context.Users.Where(x => x.Id == userId).FirstOrDefault();

            var session = new SessionUserDto { Id = user.Id, Email = user.Email, Name = user.Name, Picture = user.Picture, UpdateTime = user.UpdateTime };
            return session;
        }


    }
}
