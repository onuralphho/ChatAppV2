using ChatAppBackend.Context;
using ChatAppBackend.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace ChatAppBackend.Services
{
    public interface IAuthenticationService
    {
        TokenDto Login(int Id);
        SessionUserDto GetSession();
        string LogOut();
    }
    public class AuthenticationService:IAuthenticationService
    {
        private readonly PostgreSqlDbContext _context;
        private readonly JwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthenticationService(PostgreSqlDbContext context,JwtService jwtService, IHttpContextAccessor httpContextAccessor) { 
            _context = context;
            _jwtService = jwtService;
            _httpContextAccessor = httpContextAccessor;
        }

        TokenDto IAuthenticationService.Login(int Id)
        {


            var jwt = _jwtService.Generate(Id);

            var token = new TokenDto { TokenValue = jwt };

            return token;
        }
        SessionUserDto IAuthenticationService.GetSession()
        {

            int userId = _jwtService.UserId;

            var user = _context.Users.Where(x => x.Id == userId).FirstOrDefault();

            var session = new SessionUserDto { Id = user.Id, Email = user.Email, Name = user.Name, Picture = user.Picture, UpdateTime = user.UpdateTime };
            return session;
        }

        string IAuthenticationService.LogOut()
        {
            //Cookie silme işlemi çalışmıyor

            _httpContextAccessor.HttpContext.Response.Cookies.Delete("jwt");
            _httpContextAccessor.HttpContext.Response.Cookies.Append("jwt", "", new CookieOptions
            {
                Expires = DateTime.Now.AddDays(-1)
            });
            return "Logout Successful";
        }
    }
}
