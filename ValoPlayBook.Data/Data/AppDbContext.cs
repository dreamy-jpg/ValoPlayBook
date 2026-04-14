using Microsoft.EntityFrameworkCore;
using ValoPlayBook.Core.Models;

namespace ValoPlayBook.Data.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Team> Teams { get; set; }
        public DbSet<Map> Maps { get; set; }
        public DbSet<Agent> Agents { get; set; }
        public DbSet<Ability> Abilities { get; set; }
        public DbSet<Default> Defaults { get; set; }
        public DbSet<DefaultStep> DefaultSteps { get; set; }
        public DbSet<StepPosition> StepPositions { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}