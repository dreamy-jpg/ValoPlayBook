using System.Linq;
using ValoPlayBook.Core.Enums;
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

            // Временные значения геометрии. Можно поменять позже.
            // Для Circle: радиус 40
            // Для Line: длина 150, ширина 20
            // Для Rectangle: длина 120, ширина 80
            // Для Cone: длина 120, угол 60 градусов
            // Для ульт и сигнатурных способностей можно оставить DurationSteps=2, для остальных 1.

            var abilityData = new (Agent agent, string name, string type, int maxCharges, AbilityZoneType zoneType, double? radius, double? length, double? width, double? angle, int durationSteps)[]
            {
                // Astra
                (astra, "Gravity Well", "Basic", 1, AbilityZoneType.Circle, 40, null, null, null, 1),
                (astra, "Nova Pulse", "Basic", 1, AbilityZoneType.Circle, 40, null, null, null, 1),
                (astra, "Nebula Dissipate", "Signature", 2, AbilityZoneType.Circle, 45, null, null, null, 2),
                (astra, "Cosmic Divide", "Ultimate", 1, AbilityZoneType.Rectangle, null, 300, 80, null, 2),

                // Breach
                (breach, "Aftershock", "Basic", 1, AbilityZoneType.Line, null, 200, 30, null, 1),
                (breach, "Flashpoint", "Basic", 2, AbilityZoneType.Cone, null, 150, null, 60, 1),
                (breach, "Fault Line", "Signature", 1, AbilityZoneType.Line, null, 250, 40, null, 2),
                (breach, "Rolling Thunder", "Ultimate", 1, AbilityZoneType.Line, null, 300, 50, null, 3),

                // Brimstone
                (brim, "Incendiary", "Basic", 1, AbilityZoneType.Circle, 35, null, null, null, 1),
                (brim, "Stim Beacon", "Basic", 2, AbilityZoneType.Circle, 30, null, null, null, 1),
                (brim, "Sky Smoke", "Signature", 3, AbilityZoneType.Circle, 45, null, null, null, 2),
                (brim, "Orbital Strike", "Ultimate", 1, AbilityZoneType.Circle, 60, null, null, null, 2),

                // Chamber
                (chamber, "Trademark", "Basic", 1, AbilityZoneType.Circle, 35, null, null, null, 1),
                (chamber, "Headhunter", "Basic", 8, AbilityZoneType.Circle, 0, null, null, null, 0), // оружие
                (chamber, "Rendezvous", "Signature", 1, AbilityZoneType.Circle, 20, null, null, null, 1),
                (chamber, "Tour De Force", "Ultimate", 1, AbilityZoneType.Circle, 0, null, null, null, 0),

                // Clove
                (clove, "Pick-me-up", "Basic", 1, AbilityZoneType.Circle, 30, null, null, null, 1),
                (clove, "Meddle", "Basic", 1, AbilityZoneType.Circle, 40, null, null, null, 1),
                (clove, "Ruse", "Signature", 1, AbilityZoneType.Circle, 45, null, null, null, 2),
                (clove, "Not Dead Yet", "Ultimate", 1, AbilityZoneType.Circle, 50, null, null, null, 2),

                // Cypher
                (cypher, "Trapwire", "Basic", 2, AbilityZoneType.Line, null, 100, 10, null, 1),
                (cypher, "Cyber Cage", "Basic", 2, AbilityZoneType.Circle, 40, null, null, null, 1),
                (cypher, "Spycam", "Signature", 1, AbilityZoneType.Circle, 0, null, null, null, 0),
                (cypher, "Neural Theft", "Ultimate", 1, AbilityZoneType.Circle, 60, null, null, null, 1),

                // Deadlock
                (deadlock, "GravNet", "Basic", 1, AbilityZoneType.Circle, 45, null, null, null, 1),
                (deadlock, "Sonic Sensor", "Basic", 2, AbilityZoneType.Circle, 40, null, null, null, 1),
                (deadlock, "Barrier Mesh", "Signature", 1, AbilityZoneType.Rectangle, null, 150, 50, null, 2),
                (deadlock, "Annihilation", "Ultimate", 1, AbilityZoneType.Circle, 60, null, null, null, 2),

                // Fade
                (fade, "Prowler", "Basic", 2, AbilityZoneType.Line, null, 200, 30, null, 1),
                (fade, "Seize", "Basic", 1, AbilityZoneType.Circle, 35, null, null, null, 1),
                (fade, "Haunt", "Signature", 1, AbilityZoneType.Circle, 45, null, null, null, 1),
                (fade, "Nightfall", "Ultimate", 1, AbilityZoneType.Circle, 80, null, null, null, 2),

                // Gekko
                (gekko, "Wingman", "Basic", 1, AbilityZoneType.Line, null, 150, 20, null, 1),
                (gekko, "Dizzy", "Basic", 1, AbilityZoneType.Cone, null, 120, null, 60, 1),
                (gekko, "Mosh Pit", "Signature", 1, AbilityZoneType.Circle, 40, null, null, null, 1),
                (gekko, "Thrash", "Ultimate", 1, AbilityZoneType.Circle, 60, null, null, null, 2),

                // Harbor
                (harbor, "Cove", "Basic", 1, AbilityZoneType.Rectangle, null, 200, 80, null, 2),
                (harbor, "Storm Surge", "Basic", 2, AbilityZoneType.Line, null, 250, 30, null, 1),
                (harbor, "High Tide", "Signature", 1, AbilityZoneType.Line, null, 300, 40, null, 2),
                (harbor, "Reckoning", "Ultimate", 1, AbilityZoneType.Circle, 70, null, null, null, 3),

                // Iso
                (iso, "Undercut", "Basic", 2, AbilityZoneType.Line, null, 150, 20, null, 1),
                (iso, "Double Tap", "Basic", 2, AbilityZoneType.Circle, 0, null, null, null, 0),
                (iso, "Contingency", "Signature", 1, AbilityZoneType.Rectangle, null, 200, 60, null, 2),
                (iso, "Kill Contract", "Ultimate", 1, AbilityZoneType.Circle, 50, null, null, null, 2),

                // Jett
                (jett, "Cloudburst", "Basic", 3, AbilityZoneType.Circle, 40, null, null, null, 1),
                (jett, "Updraft", "Basic", 2, AbilityZoneType.Circle, 0, null, null, null, 0),
                (jett, "Tailwind", "Signature", 1, AbilityZoneType.Line, null, 120, 20, null, 0),
                (jett, "Blade Storm", "Ultimate", 1, AbilityZoneType.Circle, 0, null, null, null, 0),

                // Kayo
                (kayo, "FRAG-ment", "Basic", 1, AbilityZoneType.Circle, 35, null, null, null, 1),
                (kayo, "FLASH-drive", "Basic", 2, AbilityZoneType.Cone, null, 120, null, 60, 1),
                (kayo, "ZERO-point", "Signature", 1, AbilityZoneType.Line, null, 200, 30, null, 1),
                (kayo, "NULL-cmd", "Ultimate", 1, AbilityZoneType.Circle, 60, null, null, null, 2),

                // Killjoy
                (killjoy, "Nanoswarm", "Basic", 2, AbilityZoneType.Circle, 35, null, null, null, 1),
                (killjoy, "Alarmbot", "Basic", 1, AbilityZoneType.Circle, 30, null, null, null, 1),
                (killjoy, "Turret", "Signature", 1, AbilityZoneType.Circle, 25, null, null, null, 0),
                (killjoy, "Lockdown", "Ultimate", 1, AbilityZoneType.Circle, 70, null, null, null, 2),

                // Miks (пользовательский)
                (miks, "Bassquake", "Basic", 1, AbilityZoneType.Circle, 45, null, null, null, 1),
                (miks, "Harmonize", "Basic", 1, AbilityZoneType.Circle, 30, null, null, null, 1),
                (miks, "M-pulse", "Signature", 1, AbilityZoneType.Line, null, 200, 40, null, 1),
                (miks, "Waveform", "Ultimate", 1, AbilityZoneType.Circle, 80, null, null, null, 2),

                // Neon
                (neon, "Relay Bolt", "Basic", 1, AbilityZoneType.Circle, 40, null, null, null, 1),
                (neon, "High Gear", "Basic", 1, AbilityZoneType.Line, null, 150, 20, null, 0),
                (neon, "Fast Lane", "Signature", 1, AbilityZoneType.Line, null, 250, 30, null, 1),
                (neon, "Overdrive", "Ultimate", 1, AbilityZoneType.Line, null, 300, 40, null, 2),

                // Omen
                (omen, "Shrouded Step", "Basic", 2, AbilityZoneType.Circle, 0, null, null, null, 0),
                (omen, "Paranoia", "Basic", 1, AbilityZoneType.Cone, null, 150, null, 60, 1),
                (omen, "Dark Cover", "Signature", 2, AbilityZoneType.Circle, 45, null, null, null, 2),
                (omen, "From the Shadows", "Ultimate", 1, AbilityZoneType.Circle, 0, null, null, null, 0),

                // Phoenix
                (phoenix, "Blaze", "Basic", 1, AbilityZoneType.Rectangle, null, 200, 40, null, 1),
                (phoenix, "Curveball", "Basic", 2, AbilityZoneType.Cone, null, 120, null, 60, 1),
                (phoenix, "Hot Hands", "Signature", 1, AbilityZoneType.Circle, 35, null, null, null, 1),
                (phoenix, "Run it Back", "Ultimate", 1, AbilityZoneType.Circle, 0, null, null, null, 0),

                // Raze
                (raze, "Boom Bot", "Basic", 1, AbilityZoneType.Line, null, 150, 20, null, 1),
                (raze, "Blast Pack", "Basic", 2, AbilityZoneType.Circle, 35, null, null, null, 1),
                (raze, "Paint Shells", "Signature", 1, AbilityZoneType.Circle, 40, null, null, null, 1),
                (raze, "Showstopper", "Ultimate", 1, AbilityZoneType.Circle, 60, null, null, null, 1),

                // Reyna
                (reyna, "Leer", "Basic", 2, AbilityZoneType.Circle, 40, null, null, null, 1),
                (reyna, "Devour", "Signature", 2, AbilityZoneType.Circle, 30, null, null, null, 0),
                (reyna, "Dismiss", "Signature", 2, AbilityZoneType.Circle, 0, null, null, null, 0),
                (reyna, "Empress", "Ultimate", 1, AbilityZoneType.Circle, 0, null, null, null, 0),

                // Sage
                (sage, "Barrier Orb", "Basic", 1, AbilityZoneType.Rectangle, null, 300, 50, null, 2),
                (sage, "Slow Orb", "Basic", 2, AbilityZoneType.Circle, 40, null, null, null, 1),
                (sage, "Healing Orb", "Signature", 1, AbilityZoneType.Circle, 0, null, null, null, 0),
                (sage, "Resurrection", "Ultimate", 1, AbilityZoneType.Circle, 0, null, null, null, 0),

                // Skye
                (skye, "Regrowth", "Basic", 1, AbilityZoneType.Circle, 0, null, null, null, 0),
                (skye, "Trailblazer", "Basic", 1, AbilityZoneType.Line, null, 150, 30, null, 1),
                (skye, "Guiding Light", "Signature", 2, AbilityZoneType.Cone, null, 120, null, 60, 1),
                (skye, "Seekers", "Ultimate", 1, AbilityZoneType.Circle, 60, null, null, null, 2),

                // Sova
                (sova, "Owl Drone", "Basic", 1, AbilityZoneType.Line, null, 150, 20, null, 1),
                (sova, "Shock Bolt", "Basic", 2, AbilityZoneType.Circle, 35, null, null, null, 1),
                (sova, "Recon Bolt", "Signature", 1, AbilityZoneType.Circle, 45, null, null, null, 1),
                (sova, "Hunter's Fury", "Ultimate", 1, AbilityZoneType.Line, null, 300, 40, null, 2),

                // Tejo
                (tejo, "Special Delivery", "Basic", 1, AbilityZoneType.Circle, 40, null, null, null, 1),
                (tejo, "Guided Salvo", "Basic", 1, AbilityZoneType.Line, null, 200, 30, null, 1),
                (tejo, "Stealth Drone", "Signature", 1, AbilityZoneType.Line, null, 150, 20, null, 1),
                (tejo, "Armageddon", "Ultimate", 1, AbilityZoneType.Circle, 80, null, null, null, 2),

                // Veto (пользовательский)
                (veto, "Chokehold", "Basic", 1, AbilityZoneType.Rectangle, null, 150, 50, null, 1),
                (veto, "Crosscut", "Basic", 1, AbilityZoneType.Line, null, 200, 20, null, 1),
                (veto, "Evolution", "Signature", 1, AbilityZoneType.Circle, 40, null, null, null, 1),
                (veto, "Interceptor", "Ultimate", 1, AbilityZoneType.Circle, 60, null, null, null, 2),

                // Viper
                (viper, "Snake Bite", "Basic", 2, AbilityZoneType.Circle, 35, null, null, null, 1),
                (viper, "Poison Cloud", "Basic", 1, AbilityZoneType.Circle, 45, null, null, null, 2),
                (viper, "Toxic Screen", "Signature", 1, AbilityZoneType.Line, null, 400, 40, null, 2),
                (viper, "Viper's Pit", "Ultimate", 1, AbilityZoneType.Circle, 80, null, null, null, 3),

                // Vyse
                (vyse, "Razorvine", "Basic", 1, AbilityZoneType.Line, null, 150, 20, null, 1),
                (vyse, "Arc Rose", "Basic", 1, AbilityZoneType.Cone, null, 120, null, 60, 1),
                (vyse, "Shear", "Signature", 1, AbilityZoneType.Rectangle, null, 200, 40, null, 1),
                (vyse, "Steel Garden", "Ultimate", 1, AbilityZoneType.Circle, 70, null, null, null, 2),

                // Waylay
                (waylay, "Saturate", "Basic", 1, AbilityZoneType.Circle, 40, null, null, null, 1),
                (waylay, "Lightspeed", "Basic", 1, AbilityZoneType.Line, null, 150, 20, null, 0),
                (waylay, "Refract", "Signature", 1, AbilityZoneType.Circle, 0, null, null, null, 0),
                (waylay, "Convergent Paths", "Ultimate", 1, AbilityZoneType.Line, null, 300, 50, null, 2),

                // Yoru
                (yoru, "Blindside", "Basic", 2, AbilityZoneType.Cone, null, 120, null, 60, 1),
                (yoru, "Fakeout", "Basic", 1, AbilityZoneType.Circle, 0, null, null, null, 0),
                (yoru, "Gatecrash", "Signature", 1, AbilityZoneType.Circle, 20, null, null, null, 0),
                (yoru, "Dimensional Drift", "Ultimate", 1, AbilityZoneType.Circle, 0, null, null, null, 0),
            };

            foreach (var (agent, abilityName, type, maxCharges, zoneType, radius, length, width, angle, durationSteps) in abilityData)
            {
                if (!context.Abilities.Any(a => a.Name == abilityName && a.AgentId == agent.Id))
                {
                    context.Abilities.Add(new Ability
                    {
                        AgentId = agent.Id,
                        Name = abilityName,
                        Type = type,
                        MaxCharges = maxCharges,
                        ZoneType = zoneType,
                        DefaultRadius = radius,
                        DefaultLength = length,
                        DefaultWidth = width,
                        DefaultAngle = angle,
                        DefaultDurationSteps = durationSteps
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