using System.Linq;
using ValoPlayBook.Core.Models;

namespace ValoPlayBook.Data.Data
{
    public static partial class DbInitializer
    {
        private static void SeedAbilities(AppDbContext context)
        {
            var brimstone = context.Agents.First(a => a.Name == "Brimstone");
            var omen = context.Agents.First(a => a.Name == "Omen");
            var sova = context.Agents.First(a => a.Name == "Sova");
            var jett = context.Agents.First(a => a.Name == "Jett");
            var killjoy = context.Agents.First(a => a.Name == "Killjoy");
            var raze = context.Agents.First(a => a.Name == "Raze");
            var cypher = context.Agents.First(a => a.Name == "Cypher");
            var fade = context.Agents.First(a => a.Name == "Fade");
            var reyna = context.Agents.First(a => a.Name == "Reyna");
            var sage = context.Agents.First(a => a.Name == "Sage");

            var abilities = new Ability[]
            {
                // Brimstone
                new Ability { AgentId = brimstone.Id, Name = "Incendiary", Type = "Basic", MaxCharges = 1 },
                new Ability { AgentId = brimstone.Id, Name = "Stim Beacon", Type = "Basic", MaxCharges = 2 },
                new Ability { AgentId = brimstone.Id, Name = "Sky Smoke", Type = "Signature", MaxCharges = 3 },
                new Ability { AgentId = brimstone.Id, Name = "Orbital Strike", Type = "Ultimate", MaxCharges = 1 },
                // Omen
                new Ability { AgentId = omen.Id, Name = "Shrouded Step", Type = "Basic", MaxCharges = 2 },
                new Ability { AgentId = omen.Id, Name = "Paranoia", Type = "Basic", MaxCharges = 1 },
                new Ability { AgentId = omen.Id, Name = "Dark Cover", Type = "Signature", MaxCharges = 2 },
                new Ability { AgentId = omen.Id, Name = "From the Shadows", Type = "Ultimate", MaxCharges = 1 },
                // Sova
                new Ability { AgentId = sova.Id, Name = "Owl Drone", Type = "Basic", MaxCharges = 1 },
                new Ability { AgentId = sova.Id, Name = "Shock Bolt", Type = "Basic", MaxCharges = 2 },
                new Ability { AgentId = sova.Id, Name = "Recon Bolt", Type = "Signature", MaxCharges = 1 },
                new Ability { AgentId = sova.Id, Name = "Hunter's Fury", Type = "Ultimate", MaxCharges = 1 },
                // Jett
                new Ability { AgentId = jett.Id, Name = "Cloudburst", Type = "Basic", MaxCharges = 3 },
                new Ability { AgentId = jett.Id, Name = "Updraft", Type = "Basic", MaxCharges = 2 },
                new Ability { AgentId = jett.Id, Name = "Tailwind", Type = "Signature", MaxCharges = 1 },
                new Ability { AgentId = jett.Id, Name = "Blade Storm", Type = "Ultimate", MaxCharges = 1 },
                // Killjoy
                new Ability { AgentId = killjoy.Id, Name = "Nanoswarm", Type = "Basic", MaxCharges = 2 },
                new Ability { AgentId = killjoy.Id, Name = "Alarmbot", Type = "Basic", MaxCharges = 1 },
                new Ability { AgentId = killjoy.Id, Name = "Turret", Type = "Signature", MaxCharges = 1 },
                new Ability { AgentId = killjoy.Id, Name = "Lockdown", Type = "Ultimate", MaxCharges = 1 },
                // Raze
                new Ability { AgentId = raze.Id, Name = "Boom Bot", Type = "Basic", MaxCharges = 1 },
                new Ability { AgentId = raze.Id, Name = "Blast Pack", Type = "Basic", MaxCharges = 2 },
                new Ability { AgentId = raze.Id, Name = "Paint Shells", Type = "Signature", MaxCharges = 1 },
                new Ability { AgentId = raze.Id, Name = "Showstopper", Type = "Ultimate", MaxCharges = 1 },
                // Cypher
                new Ability { AgentId = cypher.Id, Name = "Trapwire", Type = "Basic", MaxCharges = 2 },
                new Ability { AgentId = cypher.Id, Name = "Cyber Cage", Type = "Basic", MaxCharges = 2 },
                new Ability { AgentId = cypher.Id, Name = "Spycam", Type = "Signature", MaxCharges = 1 },
                new Ability { AgentId = cypher.Id, Name = "Neural Theft", Type = "Ultimate", MaxCharges = 1 },
                // Fade
                new Ability { AgentId = fade.Id, Name = "Prowler", Type = "Basic", MaxCharges = 2 },
                new Ability { AgentId = fade.Id, Name = "Seize", Type = "Basic", MaxCharges = 1 },
                new Ability { AgentId = fade.Id, Name = "Haunt", Type = "Signature", MaxCharges = 1 },
                new Ability { AgentId = fade.Id, Name = "Nightfall", Type = "Ultimate", MaxCharges = 1 },
                // Reyna
                new Ability { AgentId = reyna.Id, Name = "Leer", Type = "Basic", MaxCharges = 2 },
                new Ability { AgentId = reyna.Id, Name = "Devour", Type = "Signature", MaxCharges = 2 },
                new Ability { AgentId = reyna.Id, Name = "Dismiss", Type = "Signature", MaxCharges = 2 },
                new Ability { AgentId = reyna.Id, Name = "Empress", Type = "Ultimate", MaxCharges = 1 },
                // Sage
                new Ability { AgentId = sage.Id, Name = "Barrier Orb", Type = "Basic", MaxCharges = 1 },
                new Ability { AgentId = sage.Id, Name = "Slow Orb", Type = "Basic", MaxCharges = 2 },
                new Ability { AgentId = sage.Id, Name = "Healing Orb", Type = "Signature", MaxCharges = 1 },
                new Ability { AgentId = sage.Id, Name = "Resurrection", Type = "Ultimate", MaxCharges = 1 },
            };
            context.Abilities.AddRange(abilities);
            context.SaveChanges();
        }
    }
}