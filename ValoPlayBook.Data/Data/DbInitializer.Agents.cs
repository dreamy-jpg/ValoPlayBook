using ValoPlayBook.Core.Models;

namespace ValoPlayBook.Data.Data
{
    public static partial class DbInitializer
    {
        private static void SeedAgents(AppDbContext context)
        {
            var agents = new Agent[]
            {
                new Agent { Name = "Jett", Role = "Duelist" },
                new Agent { Name = "Sova", Role = "Initiator" },
                new Agent { Name = "Omen", Role = "Controller" },
                new Agent { Name = "Killjoy", Role = "Sentinel" },
                new Agent { Name = "Raze", Role = "Duelist" },
                new Agent { Name = "Brimstone", Role = "Controller" },
                new Agent { Name = "Cypher", Role = "Sentinel" },
                new Agent { Name = "Fade", Role = "Initiator" },
                new Agent { Name = "Reyna", Role = "Duelist" },
                new Agent { Name = "Sage", Role = "Sentinel" }
            };
            context.Agents.AddRange(agents);
            context.SaveChanges();
        }
    }
}