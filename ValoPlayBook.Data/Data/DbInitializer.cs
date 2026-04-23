using Microsoft.EntityFrameworkCore;
using ValoPlayBook.Core.Models;

namespace ValoPlayBook.Data.Data
{
    public static partial class DbInitializer
    {
        public static void Seed(AppDbContext context)
        {
            context.Database.Migrate();

            SeedTeams(context);
            SeedMaps(context);
            SeedAgents(context);
            SeedAbilities(context);
            SeedUsers(context);        // <-- новый вызов
            SeedDefaults(context);

            context.SaveChanges();
        }

        private static void SeedUsers(AppDbContext context)
        {
            // Создаём администратора, если таблица пользователей пуста
            if (!context.Users.Any())
            {
                var adminUser = new User
                {
                    Email = "W@M",
                    Username = "admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("better_call_saul"), // В реальном проекте пароль должен быть сложнее
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                };
                context.Users.Add(adminUser);
            }
        }
    }
}