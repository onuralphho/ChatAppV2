using ChatAppBackend.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChatAppBackend.Context
{
    public class PostgreSqlDbContext : DbContext
    {
        public PostgreSqlDbContext(DbContextOptions<PostgreSqlDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } 
    }
}
