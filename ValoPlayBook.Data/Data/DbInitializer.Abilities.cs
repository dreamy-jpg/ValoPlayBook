using System.Linq;
using ValoPlayBook.Core.Models;

namespace ValoPlayBook.Data.Data
{
    public static partial class DbInitializer
    {
        private static void SeedAbilities(AppDbContext context)
        {
            // Получаем агентов (безопасно, т.к. они уже должны быть в контексте)
            var brimstone = context.Agents.Local.FirstOrDefault(a => a.Name == "Brimstone")
                            ?? context.Agents.First(a => a.Name == "Brimstone");
            var omen = context.Agents.Local.FirstOrDefault(a => a.Name == "Omen")
                       ?? context.Agents.First(a => a.Name == "Omen");
            var sova = context.Agents.Local.FirstOrDefault(a => a.Name == "Sova")
                       ?? context.Agents.First(a => a.Name == "Sova");
            var jett = context.Agents.Local.FirstOrDefault(a => a.Name == "Jett")
                       ?? context.Agents.First(a => a.Name == "Jett");
            var killjoy = context.Agents.Local.FirstOrDefault(a => a.Name == "Killjoy")
                          ?? context.Agents.First(a => a.Name == "Killjoy");
            var raze = context.Agents.Local.FirstOrDefault(a => a.Name == "Raze")
                       ?? context.Agents.First(a => a.Name == "Raze");
            var cypher = context.Agents.Local.FirstOrDefault(a => a.Name == "Cypher")
                         ?? context.Agents.First(a => a.Name == "Cypher");
            var fade = context.Agents.Local.FirstOrDefault(a => a.Name == "Fade")
                       ?? context.Agents.First(a => a.Name == "Fade");
            var reyna = context.Agents.Local.FirstOrDefault(a => a.Name == "Reyna")
                        ?? context.Agents.First(a => a.Name == "Reyna");
            var sage = context.Agents.Local.FirstOrDefault(a => a.Name == "Sage")
                       ?? context.Agents.First(a => a.Name == "Sage");

            // Структура: (агент, название способности, тип, максимальные заряды)
            var abilityData = new (Agent agent, string name, string type, int maxCharges)[]
            {
                // Brimstone
                (brimstone, "Incendiary", "Basic", 1),
                (brimstone, "Stim Beacon", "Basic", 2),
                (brimstone, "Sky Smoke", "Signature", 3),
                (brimstone, "Orbital Strike", "Ultimate", 1),
                // Omen
                (omen, "Shrouded Step", "Basic", 2),
                (omen, "Paranoia", "Basic", 1),
                (omen, "Dark Cover", "Signature", 2),
                (omen, "From the Shadows", "Ultimate", 1),
                // Sova
                (sova, "Owl Drone", "Basic", 1),
                (sova, "Shock Bolt", "Basic", 2),
                (sova, "Recon Bolt", "Signature", 1),
                (sova, "Hunter's Fury", "Ultimate", 1),
                // Jett
                (jett, "Cloudburst", "Basic", 3),
                (jett, "Updraft", "Basic", 2),
                (jett, "Tailwind", "Signature", 1),
                (jett, "Blade Storm", "Ultimate", 1),
                // Killjoy
                (killjoy, "Nanoswarm", "Basic", 2),
                (killjoy, "Alarmbot", "Basic", 1),
                (killjoy, "Turret", "Signature", 1),
                (killjoy, "Lockdown", "Ultimate", 1),
                // Raze
                (raze, "Boom Bot", "Basic", 1),
                (raze, "Blast Pack", "Basic", 2),
                (raze, "Paint Shells", "Signature", 1),
                (raze, "Showstopper", "Ultimate", 1),
                // Cypher
                (cypher, "Trapwire", "Basic", 2),
                (cypher, "Cyber Cage", "Basic", 2),
                (cypher, "Spycam", "Signature", 1),
                (cypher, "Neural Theft", "Ultimate", 1),
                // Fade
                (fade, "Prowler", "Basic", 2),
                (fade, "Seize", "Basic", 1),
                (fade, "Haunt", "Signature", 1),
                (fade, "Nightfall", "Ultimate", 1),
                // Reyna
                (reyna, "Leer", "Basic", 2),
                (reyna, "Devour", "Signature", 2),
                (reyna, "Dismiss", "Signature", 2),
                (reyna, "Empress", "Ultimate", 1),
                // Sage
                (sage, "Barrier Orb", "Basic", 1),
                (sage, "Slow Orb", "Basic", 2),
                (sage, "Healing Orb", "Signature", 1),
                (sage, "Resurrection", "Ultimate", 1),
            };

            foreach (var (agent, abilityName, type, maxCharges) in abilityData)
            {
                if (!context.Abilities.Any(a => a.Name == abilityName && a.AgentId == agent.Id))
                {
                    context.Abilities.Add(new Ability
                    {
                        AgentId = agent.Id,
                        Name = abilityName,
                        Type = type,
                        MaxCharges = maxCharges
                    });
                }
            }
        }
    }
}