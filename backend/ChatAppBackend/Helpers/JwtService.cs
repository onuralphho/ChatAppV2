using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.Extensions.Configuration;
using ChatAppBackend.Entities;
using System.Security.Claims;
using Microsoft.Extensions.Options;
using ChatAppBackend.Models;

namespace ChatAppBackend.Helpers
{
    public class JwtService
    {


        private readonly IOptions<JwtOptions> _options;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public JwtService(IOptions<JwtOptions> options, IHttpContextAccessor httpContextAccessor)
        {
            _options = options;
            _httpContextAccessor = httpContextAccessor;
        }

        public int UserId => int.Parse(_httpContextAccessor.HttpContext?.User?.FindFirstValue(JwtRegisteredClaimNames.UniqueName));

        public string Generate(int id)
        {

            var claims = new[] {
                        new Claim(JwtRegisteredClaimNames.Sub, _options.Value.Subject),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                        new Claim(JwtRegisteredClaimNames.UniqueName, id.ToString())
                    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Value.Key));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                _options.Value.Issuer,
                _options.Value.Audience,
                claims,
                expires: DateTime.UtcNow.AddDays(1),//case çalışması olduğu için süreyi uzun verdim.
                signingCredentials: signIn);


            //var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secureKey));
            //var credentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256Signature);
            //var header = new JwtHeader(credentials);

            //var payload = new JwtPayload(id.ToString(), null, null, null, DateTime.Today.AddDays(1));
            //var securityToken = new JwtSecurityToken(header, payload);

            return new JwtSecurityTokenHandler().WriteToken(token);

        }
        //public JwtSecurityToken Verify(string jwt)
        //{
        //    var tokenHandler = new JwtSecurityTokenHandler();
        //    var key = Encoding.ASCII.GetBytes();
        //    tokenHandler.ValidateToken(jwt, new TokenValidationParameters
        //    {
        //        IssuerSigningKey = new SymmetricSecurityKey(key),
        //        ValidateIssuerSigningKey = true,
        //        ValidateIssuer = false,
        //        ValidateAudience = false,

        //    }, out SecurityToken validatedToken);

        //    return (JwtSecurityToken)validatedToken;
        //}
    }
}
