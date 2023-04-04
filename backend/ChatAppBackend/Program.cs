using ChatAppBackend.Context;
using ChatAppBackend.Helpers;
using ChatAppBackend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

#region Authentication
var jwtOption = builder.Configuration.GetSection(JwtOptions.Jwt).Get<JwtOptions>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.Events = new JwtBearerEvents() { OnAuthenticationFailed = field => {
        return Task.CompletedTask;
    } };
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = jwtOption.Audience,
        ValidIssuer = jwtOption.Issuer,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOption.Key))
    };
});
#endregion
builder.Services.AddHttpContextAccessor();

var settings = builder.Configuration.GetSection("ConnectionStrings").Get<Connection>();

builder.Services.AddDbContext<PostgreSqlDbContext>(options => options.UseNpgsql(settings.DefaultConnection)); //TODO:appsettingsden çekilecek // DONE

builder.Services.AddScoped<JwtService>();

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.Jwt));



var app = builder.Build();




app.UseCors(options =>
options.WithOrigins("http://localhost:3000")//TODO:AllowAnyOrigin
.AllowAnyMethod().AllowAnyHeader().AllowCredentials());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();
app.UseAuthentication();

app.UseEndpoints(endpoints=>{endpoints.MapControllers();});
app.Run();
