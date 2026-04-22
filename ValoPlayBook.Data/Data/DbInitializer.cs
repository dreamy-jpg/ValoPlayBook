using Microsoft.EntityFrameworkCore;
using ValoPlayBook.Data.Data;

namespace ValoPlayBook.Data.Data
{
    public static partial class DbInitializer
    {
        public static void Seed(AppDbContext context)
        {
            context.Database.Migrate();

            // Закомментируй эту проверку перед первым запуском, чтобы сид выполнился
            if (context.Teams.Any() || context.Maps.Any() || context.Agents.Any())
                return;

            SeedTeams(context);
            SeedMaps(context);
            SeedAgents(context);
            SeedAbilities(context);
            SeedDefaults(context);
        }
    }
}