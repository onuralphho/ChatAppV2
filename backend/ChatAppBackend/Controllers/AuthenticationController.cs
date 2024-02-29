
namespace ChatAppBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class AuthenticationController : ControllerBase
    {

        private readonly IAuthenticationService _authenticationService;
        public AuthenticationController( IAuthenticationService authenticationService)
        {
       
            _authenticationService = authenticationService;
        }


        [AllowAnonymous]
        [HttpPost("login")]

        public TokenDto Login(AuthDto auth)
        {
            var token = _authenticationService.Login(auth);

            if (token == null)
            {
                throw new BadRequestException("Given credentials are invalid","invalid_credentials");
            }
            else
            {
                //checkout this
                //var options = new CookieOptions
                //{
                //    HttpOnly = true,
                //    Expires = DateTime.Now.AddDays(1),
                //    SameSite = SameSiteMode.Strict,
                //    Path = "/"
                //};

                //HttpContext.Response.Cookies.Append("jwt", token.TokenValue, options);

                return token;
            }
        }

        [HttpGet("session")]
        public SessionUserDto Session()
        {

            return _authenticationService.GetSession();
        }

        [HttpGet("logout")]
        public ActionResult Logout()
        {

            //Cookie silme işlemi çalışmıyor

            //_httpContextAccessor.HttpContext.Response.Cookies.Delete("jwt");
            //_httpContextAccessor.HttpContext.Response.Cookies.Append("jwt", "", new CookieOptions
            //{
            //    Expires = DateTime.Now.AddDays(-1)
            //});

            return Ok();
        }


    }
}
