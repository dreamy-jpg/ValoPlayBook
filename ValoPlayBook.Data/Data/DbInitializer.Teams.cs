using ValoPlayBook.Core.Models;

namespace ValoPlayBook.Data.Data
{
    public static partial class DbInitializer
    {
        private static void SeedTeams(AppDbContext context)
        {
            var teams = new Team[]
            {
                new Team { Name = "Fnatic", Region = "EMEA" },
                new Team { Name = "Sentinels", Region = "Americas" },
                new Team { Name = "Paper Rex", Region = "Pacific" }
            };
            context.Teams.AddRange(teams);
            context.SaveChanges();
        }
    }
}