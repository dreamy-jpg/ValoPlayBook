using System.Linq;
using ValoPlayBook.Core.Models;

namespace ValoPlayBook.Data.Data
{
    public static partial class DbInitializer
    {
        private static void SeedAbilities(AppDbContext context)
        {
            var astra = GetAgent(context, "Astra");
            var breach = GetAgent(context, "Breach");
            var brim = GetAgent(context, "Brimstone");
            var chamber = GetAgent(context, "Chamber");
            var clove = GetAgent(context, "Clove");
            var cypher = GetAgent(context, "Cypher");
            var deadlock = GetAgent(context, "Deadlock");
            var fade = GetAgent(context, "Fade");
            var gekko = GetAgent(context, "Gekko");
            var harbor = GetAgent(context, "Harbor");
            var iso = GetAgent(context, "Iso");
            var jett = GetAgent(context, "Jett");
            var kayo = GetAgent(context, "Kayo");
            var killjoy = GetAgent(context, "Killjoy");
            var miks = GetAgent(context, "Miks");
            var neon = GetAgent(context, "Neon");
            var omen = GetAgent(context, "Omen");
            var phoenix = GetAgent(context, "Phoenix");
            var raze = GetAgent(context, "Raze");
            var reyna = GetAgent(context, "Reyna");
            var sage = GetAgent(context, "Sage");
            var skye = GetAgent(context, "Skye");
            var sova = GetAgent(context, "Sova");
            var tejo = GetAgent(context, "Tejo");
            var veto = GetAgent(context, "Veto");
            var viper = GetAgent(context, "Viper");
            var vyse = GetAgent(context, "Vyse");
            var waylay = GetAgent(context, "Waylay");
            var yoru = GetAgent(context, "Yoru");

            var abilityData = new (Agent agent, string name, string type, int maxCharges)[]
            {
                // Astra
                (astra, "Gravity Well", "Basic", 1),
                (astra, "Nova Pulse", "Basic", 1),
                (astra, "Nebula Dissipate", "Signature", 2),
                (astra, "Cosmic Divide", "Ultimate", 1),

                // Breach
                (breach, "Aftershock", "Basic", 1),
                (breach, "Flashpoint", "Basic", 2),
                (breach, "Fault Line", "Signature", 1),
                (breach, "Rolling Thunder", "Ultimate", 1),

                // Brimstone
                (brim, "Incendiary", "Basic", 1),
                (brim, "Stim Beacon", "Basic", 2),
                (brim, "Sky Smoke", "Signature", 3),
                (brim, "Orbital Strike", "Ultimate", 1),

                // Chamber
                (chamber, "Trademark", "Basic", 1),
                (chamber, "Headhunter", "Basic", 8),
                (chamber, "Rendezvous", "Signature", 1),
                (chamber, "Tour De Force", "Ultimate", 1),

                // Clove
                (clove, "Pick-me-up", "Basic", 1),
                (clove, "Meddle", "Basic", 1),
                (clove, "Ruse", "Signature", 1),
                (clove, "Not Dead Yet", "Ultimate", 1),

                // Cypher
                (cypher, "Trapwire", "Basic", 2),
                (cypher, "Cyber Cage", "Basic", 2),
                (cypher, "Spycam", "Signature", 1),
                (cypher, "Neural Theft", "Ultimate", 1),

                // Deadlock
                (deadlock, "GravNet", "Basic", 1),
                (deadlock, "Sonic Sensor", "Basic", 2),
                (deadlock, "Barrier Mesh", "Signature", 1),
                (deadlock, "Annihilation", "Ultimate", 1),

                // Fade
                (fade, "Prowler", "Basic", 2),
                (fade, "Seize", "Basic", 1),
                (fade, "Haunt", "Signature", 1),
                (fade, "Nightfall", "Ultimate", 1),

                // Gekko
                (gekko, "Wingman", "Basic", 1),
                (gekko, "Dizzy", "Basic", 1),
                (gekko, "Mosh Pit", "Signature", 1),
                (gekko, "Thrash", "Ultimate", 1),

                // Harbor
                (harbor, "Cove", "Basic", 1),
                (harbor, "Storm Surge", "Basic", 2),   // было Cascade
                (harbor, "High Tide", "Signature", 1),
                (harbor, "Reckoning", "Ultimate", 1),

                // Iso
                (iso, "Undercut", "Basic", 2),
                (iso, "Double Tap", "Basic", 2),
                (iso, "Contingency", "Signature", 1),
                (iso, "Kill Contract", "Ultimate", 1),

                // Jett
                (jett, "Cloudburst", "Basic", 3),
                (jett, "Updraft", "Basic", 2),
                (jett, "Tailwind", "Signature", 1),
                (jett, "Blade Storm", "Ultimate", 1),

                // Kayo (имена с дефисом, а не слешем)
                (kayo, "FRAG-ment", "Basic", 1),
                (kayo, "FLASH-drive", "Basic", 2),
                (kayo, "ZERO-point", "Signature", 1),
                (kayo, "NULL-cmd", "Ultimate", 1),

                // Killjoy
                (killjoy, "Nanoswarm", "Basic", 2),
                (killjoy, "Alarmbot", "Basic", 1),
                (killjoy, "Turret", "Signature", 1),
                (killjoy, "Lockdown", "Ultimate", 1),

                // Miks (пользовательский)
                (miks, "Bassquake", "Basic", 1),
                (miks, "Harmonize", "Basic", 1),
                (miks, "M-pulse", "Signature", 1),
                (miks, "Waveform", "Ultimate", 1),

                // Neon
                (neon, "Relay Bolt", "Basic", 1),
                (neon, "High Gear", "Basic", 1),
                (neon, "Fast Lane", "Signature", 1),
                (neon, "Overdrive", "Ultimate", 1),

                // Omen
                (omen, "Shrouded Step", "Basic", 2),
                (omen, "Paranoia", "Basic", 1),
                (omen, "Dark Cover", "Signature", 2),
                (omen, "From the Shadows", "Ultimate", 1),

                // Phoenix
                (phoenix, "Blaze", "Basic", 1),
                (phoenix, "Curveball", "Basic", 2),
                (phoenix, "Hot Hands", "Signature", 1),
                (phoenix, "Run it Back", "Ultimate", 1),

                // Raze
                (raze, "Boom Bot", "Basic", 1),
                (raze, "Blast Pack", "Basic", 2),
                (raze, "Paint Shells", "Signature", 1),
                (raze, "Showstopper", "Ultimate", 1),

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

                // Skye
                (skye, "Regrowth", "Basic", 1),
                (skye, "Trailblazer", "Basic", 1),
                (skye, "Guiding Light", "Signature", 2),
                (skye, "Seekers", "Ultimate", 1),

                // Sova
                (sova, "Owl Drone", "Basic", 1),
                (sova, "Shock Bolt", "Basic", 2),
                (sova, "Recon Bolt", "Signature", 1),
                (sova, "Hunter's Fury", "Ultimate", 1),

                // Tejo
                (tejo, "Special Delivery", "Basic", 1),
                (tejo, "Guided Salvo", "Basic", 1),
                (tejo, "Stealth Drone", "Signature", 1),
                (tejo, "Armageddon", "Ultimate", 1),

                // Veto (пользовательский)
                (veto, "Chokehold", "Basic", 1),
                (veto, "Crosscut", "Basic", 1),
                (veto, "Evolution", "Signature", 1),
                (veto, "Interceptor", "Ultimate", 1),

                // Viper
                (viper, "Snake Bite", "Basic", 2),
                (viper, "Poison Cloud", "Basic", 1),
                (viper, "Toxic Screen", "Signature", 1),
                (viper, "Viper's Pit", "Ultimate", 1),

                // Vyse
                (vyse, "Razorvine", "Basic", 1),
                (vyse, "Arc Rose", "Basic", 1),
                (vyse, "Shear", "Signature", 1),
                (vyse, "Steel Garden", "Ultimate", 1),

                // Waylay
                (waylay, "Saturate", "Basic", 1),
                (waylay, "Lightspeed", "Basic", 1),
                (waylay, "Refract", "Signature", 1),
                (waylay, "Convergent Paths", "Ultimate", 1),

                // Yoru
                (yoru, "Blindside", "Basic", 2),
                (yoru, "Fakeout", "Basic", 1),
                (yoru, "Gatecrash", "Signature", 1),
                (yoru, "Dimensional Drift", "Ultimate", 1),
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

        private static Agent GetAgent(AppDbContext context, string name)
        {
            return context.Agents.Local.FirstOrDefault(a => a.Name == name)
                   ?? context.Agents.First(a => a.Name == name);
        }
    }
}