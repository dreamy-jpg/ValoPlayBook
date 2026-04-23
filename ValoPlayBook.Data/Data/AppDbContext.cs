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
        public DbSet<StepAbility> StepAbilities { get; set; }

        // Новые DbSet
        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Связь User -> RefreshTokens (каскадное удаление при удалении пользователя)
            modelBuilder.Entity<RefreshToken>()
                .HasOne(rt => rt.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Связь User -> Comments (при удалении пользователя UserId устанавливается в null)
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            // Связь User -> Defaults (при удалении пользователя CreatedByUserId = null)
            modelBuilder.Entity<Default>()
                .HasOne(d => d.CreatedByUser)
                .WithMany(u => u.CreatedDefaults)
                .HasForeignKey(d => d.CreatedByUserId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}