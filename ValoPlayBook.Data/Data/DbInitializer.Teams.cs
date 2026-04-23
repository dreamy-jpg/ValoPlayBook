using System.Linq;
using ValoPlayBook.Core.Models;

namespace ValoPlayBook.Data.Data
{
    public static partial class DbInitializer
    {
        private static void SeedTeams(AppDbContext context)
        {
            // Проверяем наличие каждой команды отдельно
            if (!context.Teams.Any(t => t.Name == "Fnatic"))
                context.Teams.Add(new Team { Name = "Fnatic", Region = "EMEA" });

            if (!context.Teams.Any(t => t.Name == "Sentinels"))
                context.Teams.Add(new Team { Name = "Sentinels", Region = "Americas" });

            if (!context.Teams.Any(t => t.Name == "Paper Rex"))
                context.Teams.Add(new Team { Name = "Paper Rex", Region = "Pacific" });
        }
    }
}