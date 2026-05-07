using System.Linq;
using ValoPlayBook.Core.Models;

namespace ValoPlayBook.Data.Data
{
    public static partial class DbInitializer
    {
        private static void SeedAgents(AppDbContext context)
        {
            // Массив агентов с именами и ролями
            var agentData = new[]
            {
                ("Jett", "Duelist"),
                ("Sova", "Initiator"),
                ("Omen", "Controller"),
                ("Killjoy", "Sentinel"),
                ("Raze", "Duelist"),
                ("Brimstone", "Controller"),
                ("Cypher", "Sentinel"),
                ("Fade", "Initiator"),
                ("Reyna", "Duelist"),
                ("Sage", "Sentinel"),
                ("Astra", "Controller"),
                ("Breach", "Initiator"),
                ("Chamber", "Sentinel"),
                ("Clove", "Controller"),
                ("Deadlock", "Sentinel"),
                ("Gekko", "Initiator"),
                ("Harbor", "Controller"),
                ("Iso", "Duelist"),
                ("Kayo", "Initiator"),
                ("Neon", "Duelist"),
                ("Phoenix", "Duelist"),
                ("Skye", "Initiator"),
                ("Tejo", "Controller"),
                ("Viper", "Controller"),
                ("Vyse", "Sentinel"),
                ("Waylay", "Duelist"),
                ("Yoru", "Duelist"),
                ("Miks", "Controller"),
                ("Veto", "Sentinel")
            };

            foreach (var (name, role) in agentData)
            {
                if (!context.Agents.Any(a => a.Name == name))
                {
                    context.Agents.Add(new Agent { Name = name, Role = role });
                }
            }
        }
    }
}