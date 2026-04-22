using System.Linq;
using ValoPlayBook.Core.Enums;
using ValoPlayBook.Core.Models;

namespace ValoPlayBook.Data.Data
{
    public static partial class DbInitializer
    {
        private static void SeedDefaults(AppDbContext context)
        {
            var fnatic = context.Teams.First(t => t.Name == "Fnatic");
            var sentinels = context.Teams.First(t => t.Name == "Sentinels");
            var ascent = context.Maps.First(m => m.Name == "Ascent");

            var jett = context.Agents.First(a => a.Name == "Jett");
            var sova = context.Agents.First(a => a.Name == "Sova");
            var omen = context.Agents.First(a => a.Name == "Omen");
            var killjoy = context.Agents.First(a => a.Name == "Killjoy");
            var raze = context.Agents.First(a => a.Name == "Raze");
            var brimstone = context.Agents.First(a => a.Name == "Brimstone");
            var cypher = context.Agents.First(a => a.Name == "Cypher");
            var fade = context.Agents.First(a => a.Name == "Fade");
            var reyna = context.Agents.First(a => a.Name == "Reyna");
            var sage = context.Agents.First(a => a.Name == "Sage");

            // --- Единственный дефолт: Fnatic vs Sentinels (полный раунд, 10 агентов, 4 шага) ---
            var defaultFull = new Default
            {
                Title = "Fnatic vs Sentinels Ascent Full Round",
                Description = "Полный раунд: атака Fnatic (Jett, Sova, Omen, Killjoy, Raze) и защита Sentinels (Brimstone, Cypher, Fade, Reyna, Sage).",
                TeamId = fnatic.Id,
                MapId = ascent.Id,
                Side = Side.Attack,
                RoundNumber = 1,
                OpponentTeamName = "Sentinels",
                YoutubeUrl = "https://youtu.be/example?t=789"
            };
            context.Defaults.Add(defaultFull);
            context.SaveChanges();

            // 4 шага
            var step1 = new DefaultStep { DefaultId = defaultFull.Id, StepNumber = 1, Comment = "Расстановка. Атака готовится к выходу, защита занимает позиции." };
            var step2 = new DefaultStep { DefaultId = defaultFull.Id, StepNumber = 2, Comment = "Атака: Omen курит CT и Heaven, Sova разведка. Защита: Brimstone смок в A Main, Cypher Trapwire." };
            var step3 = new DefaultStep { DefaultId = defaultFull.Id, StepNumber = 3, Comment = "Атака: Raze Boom Bot, Killjoy Nanoswarm. Защита: Fade Haunt, Reyna Leer." };
            var step4 = new DefaultStep { DefaultId = defaultFull.Id, StepNumber = 4, Comment = "Атака заходит на точку. Защита отступает или контратакует." };
            context.DefaultSteps.AddRange(step1, step2, step3, step4);
            context.SaveChanges();

            // Позиции атаки (IsAttacker = true)
            var attackPositions = new[]
            {
                // Шаг 1
                new StepPosition { StepId = step1.Id, AgentId = jett.Id, X = 120, Y = 100, IsAttacker = true },
                new StepPosition { StepId = step1.Id, AgentId = sova.Id, X = 220, Y = 150, IsAttacker = true },
                new StepPosition { StepId = step1.Id, AgentId = omen.Id, X = 320, Y = 200, IsAttacker = true },
                new StepPosition { StepId = step1.Id, AgentId = killjoy.Id, X = 420, Y = 250, IsAttacker = true },
                new StepPosition { StepId = step1.Id, AgentId = raze.Id, X = 150, Y = 300, IsAttacker = true },
                // Шаг 2
                new StepPosition { StepId = step2.Id, AgentId = jett.Id, X = 170, Y = 130, IsAttacker = true },
                new StepPosition { StepId = step2.Id, AgentId = sova.Id, X = 270, Y = 180, IsAttacker = true },
                new StepPosition { StepId = step2.Id, AgentId = omen.Id, X = 370, Y = 230, IsAttacker = true },
                new StepPosition { StepId = step2.Id, AgentId = killjoy.Id, X = 470, Y = 280, IsAttacker = true },
                new StepPosition { StepId = step2.Id, AgentId = raze.Id, X = 200, Y = 330, IsAttacker = true },
                // Шаг 3
                new StepPosition { StepId = step3.Id, AgentId = jett.Id, X = 220, Y = 160, IsAttacker = true },
                new StepPosition { StepId = step3.Id, AgentId = sova.Id, X = 320, Y = 210, IsAttacker = true },
                new StepPosition { StepId = step3.Id, AgentId = omen.Id, X = 420, Y = 260, IsAttacker = true },
                new StepPosition { StepId = step3.Id, AgentId = killjoy.Id, X = 520, Y = 310, IsAttacker = true },
                new StepPosition { StepId = step3.Id, AgentId = raze.Id, X = 250, Y = 360, IsAttacker = true },
                // Шаг 4
                new StepPosition { StepId = step4.Id, AgentId = jett.Id, X = 270, Y = 190, IsAttacker = true },
                new StepPosition { StepId = step4.Id, AgentId = sova.Id, X = 370, Y = 240, IsAttacker = true },
                new StepPosition { StepId = step4.Id, AgentId = omen.Id, X = 470, Y = 290, IsAttacker = true },
                new StepPosition { StepId = step4.Id, AgentId = killjoy.Id, X = 570, Y = 340, IsAttacker = true },
                new StepPosition { StepId = step4.Id, AgentId = raze.Id, X = 300, Y = 390, IsAttacker = true },
            };

            // Позиции защиты (IsAttacker = false)
            var defensePositions = new[]
            {
                // Шаг 1
                new StepPosition { StepId = step1.Id, AgentId = brimstone.Id, X = 700, Y = 150, IsAttacker = false },
                new StepPosition { StepId = step1.Id, AgentId = cypher.Id, X = 650, Y = 250, IsAttacker = false },
                new StepPosition { StepId = step1.Id, AgentId = fade.Id, X = 750, Y = 200, IsAttacker = false },
                new StepPosition { StepId = step1.Id, AgentId = reyna.Id, X = 600, Y = 300, IsAttacker = false },
                new StepPosition { StepId = step1.Id, AgentId = sage.Id, X = 550, Y = 350, IsAttacker = false },
                // Шаг 2
                new StepPosition { StepId = step2.Id, AgentId = brimstone.Id, X = 670, Y = 130, IsAttacker = false },
                new StepPosition { StepId = step2.Id, AgentId = cypher.Id, X = 620, Y = 230, IsAttacker = false },
                new StepPosition { StepId = step2.Id, AgentId = fade.Id, X = 720, Y = 180, IsAttacker = false },
                new StepPosition { StepId = step2.Id, AgentId = reyna.Id, X = 570, Y = 280, IsAttacker = false },
                new StepPosition { StepId = step2.Id, AgentId = sage.Id, X = 520, Y = 330, IsAttacker = false },
                // Шаг 3
                new StepPosition { StepId = step3.Id, AgentId = brimstone.Id, X = 640, Y = 110, IsAttacker = false },
                new StepPosition { StepId = step3.Id, AgentId = cypher.Id, X = 590, Y = 210, IsAttacker = false },
                new StepPosition { StepId = step3.Id, AgentId = fade.Id, X = 690, Y = 160, IsAttacker = false },
                new StepPosition { StepId = step3.Id, AgentId = reyna.Id, X = 540, Y = 260, IsAttacker = false },
                new StepPosition { StepId = step3.Id, AgentId = sage.Id, X = 490, Y = 310, IsAttacker = false },
                // Шаг 4
                new StepPosition { StepId = step4.Id, AgentId = brimstone.Id, X = 610, Y = 90, IsAttacker = false },
                new StepPosition { StepId = step4.Id, AgentId = cypher.Id, X = 560, Y = 190, IsAttacker = false },
                new StepPosition { StepId = step4.Id, AgentId = fade.Id, X = 660, Y = 140, IsAttacker = false },
                new StepPosition { StepId = step4.Id, AgentId = reyna.Id, X = 510, Y = 240, IsAttacker = false },
                new StepPosition { StepId = step4.Id, AgentId = sage.Id, X = 460, Y = 290, IsAttacker = false },
            };

            context.StepPositions.AddRange(attackPositions);
            context.StepPositions.AddRange(defensePositions);
            context.SaveChanges();

            // Способности для шагов 2 и 3
            var skySmokeBrim = context.Abilities.First(a => a.Name == "Sky Smoke" && a.AgentId == brimstone.Id);
            var darkCoverOmen = context.Abilities.First(a => a.Name == "Dark Cover" && a.AgentId == omen.Id);
            var reconBoltSova = context.Abilities.First(a => a.Name == "Recon Bolt" && a.AgentId == sova.Id);
            var boomBotRaze = context.Abilities.First(a => a.Name == "Boom Bot" && a.AgentId == raze.Id);
            var nanoswarmKilljoy = context.Abilities.First(a => a.Name == "Nanoswarm" && a.AgentId == killjoy.Id);
            var trapwireCypher = context.Abilities.First(a => a.Name == "Trapwire" && a.AgentId == cypher.Id);
            var hauntFade = context.Abilities.First(a => a.Name == "Haunt" && a.AgentId == fade.Id);
            var leerReyna = context.Abilities.First(a => a.Name == "Leer" && a.AgentId == reyna.Id);
            var slowOrbSage = context.Abilities.First(a => a.Name == "Slow Orb" && a.AgentId == sage.Id);

            var step2Abilities = new StepAbility[]
            {
                // Атака
                new StepAbility { ActivationStepId = step2.Id, AbilityId = darkCoverOmen.Id, AgentId = omen.Id, X = 550, Y = 150, Radius = 45, DurationSteps = 2 },
                new StepAbility { ActivationStepId = step2.Id, AbilityId = reconBoltSova.Id, AgentId = sova.Id, X = 400, Y = 200, Rotation = 45, Radius = 30, DurationSteps = 1 },
                // Защита
                new StepAbility { ActivationStepId = step2.Id, AbilityId = skySmokeBrim.Id, AgentId = brimstone.Id, X = 350, Y = 250, Radius = 45, DurationSteps = 2 },
                new StepAbility { ActivationStepId = step2.Id, AbilityId = skySmokeBrim.Id, AgentId = brimstone.Id, X = 450, Y = 200, Radius = 45, DurationSteps = 2 },
                new StepAbility { ActivationStepId = step2.Id, AbilityId = trapwireCypher.Id, AgentId = cypher.Id, X = 500, Y = 300, Rotation = 0, DurationSteps = 1 },
            };
            context.StepAbilities.AddRange(step2Abilities);

            var step3Abilities = new StepAbility[]
            {
                // Атака
                new StepAbility { ActivationStepId = step3.Id, AbilityId = boomBotRaze.Id, AgentId = raze.Id, X = 250, Y = 400, Rotation = 90, DurationSteps = 1 },
                new StepAbility { ActivationStepId = step3.Id, AbilityId = nanoswarmKilljoy.Id, AgentId = killjoy.Id, X = 300, Y = 350, Radius = 25, DurationSteps = 1 },
                // Защита
                new StepAbility { ActivationStepId = step3.Id, AbilityId = hauntFade.Id, AgentId = fade.Id, X = 400, Y = 150, Radius = 35, DurationSteps = 1 },
                new StepAbility { ActivationStepId = step3.Id, AbilityId = leerReyna.Id, AgentId = reyna.Id, X = 300, Y = 350, Rotation = 180, DurationSteps = 1 },
                new StepAbility { ActivationStepId = step3.Id, AbilityId = slowOrbSage.Id, AgentId = sage.Id, X = 600, Y = 400, Radius = 30, DurationSteps = 1 },
            };
            context.StepAbilities.AddRange(step3Abilities);
            context.SaveChanges();
        }
    }
}