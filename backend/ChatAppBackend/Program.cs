using ChatAppBackend.Context;
using ChatAppBackend.Exceptions;
using ChatAppBackend.Filters;
using ChatAppBackend.Helpers;
using ChatAppBackend.Hubs;
using ChatAppBackend.Models;
using ChatAppBackend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

//Swagger
builder.Services.AddSwaggerGen(s =>
{
    s.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header using the Bearer scheme. \r\n\r\n 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      \r\n\r\nExample: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    s.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                  {
                    new OpenApiSecurityScheme
                    {
                      Reference = new OpenApiReference
                        {
                          Type = ReferenceType.SecurityScheme,
                          Id = "Bearer"
                        },
                        Scheme = "oauth2",
                        Name = "Bearer",
                        In = ParameterLocation.Header,

                      },
                      new List<string>()
                    }
                  });
});

//JWT
#region Authentication
var jwtOption = builder.Configuration.GetSection(JwtOptions.Jwt).Get<JwtOptions>();

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.Events = new JwtBearerEvents()
    {
        OnAuthenticationFailed = field =>
        {
            return Task.CompletedTask;
        }
    };
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

var allowedOrigin = builder.Configuration.GetSection("AllowedOrigin").Value;

builder.Services.AddDbContext<PostgreSqlDbContext>(options => options.UseNpgsql(settings.DefaultConnection)); 

builder.Services.AddScoped<JwtService>();

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.Jwt));

builder.Services.AddAutoMapper(typeof(Program).Assembly);

builder.Services.AddSignalR();

builder.Services.AddScoped<IMessageService, MessageService>();

builder.Services.AddScoped<IFriendBoxService, FriendBoxService>();

builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ErrorHandlingFilter>();
    options.Filters.Add(new ProducesResponseTypeAttribute(typeof(ProblemDetails), StatusCodes.Status400BadRequest));
    options.Filters.Add(new ProducesResponseTypeAttribute(typeof(ProblemDetails), StatusCodes.Status404NotFound));
    options.Filters.Add(new ProducesResponseTypeAttribute(typeof(ProblemDetails), StatusCodes.Status500InternalServerError));
    options.Filters.Add(new ProducesResponseTypeAttribute( StatusCodes.Status200OK));
});

var app = builder.Build();



app.UseCors(options => options
    .WithOrigins(allowedOrigin)
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints => { endpoints.MapControllers(); });

app.UseEndpoints(endpoints => { endpoints.MapHub<ChatHub>("/chatHub"); });
app.Run();
