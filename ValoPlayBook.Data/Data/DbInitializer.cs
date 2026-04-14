using Microsoft.EntityFrameworkCore;
using ValoPlayBook.Core.Enums;
using ValoPlayBook.Core.Models;

namespace ValoPlayBook.Data.Data
{
    public static class DbInitializer
    {
        public static void Seed(AppDbContext context)
        {
            context.Database.Migrate(); // применяем миграции, если ещё не

            // Если данные уже есть — выходим
            if (context.Teams.Any() || context.Maps.Any() || context.Agents.Any())
                return;

            // --- Команды ---
            var teams = new Team[]
            {
                new Team { Name = "Fnatic", Region = "EMEA" },
                new Team { Name = "Sentinels", Region = "Americas" },
                new Team { Name = "Paper Rex", Region = "Pacific" }
            };
            context.Teams.AddRange(teams);
            context.SaveChanges();

            // --- Карты ---
            var maps = new Map[]
            {
                new Map { Name = "Ascent" },
                new Map { Name = "Bind" },
                new Map { Name = "Haven" }
            };
            context.Maps.AddRange(maps);
            context.SaveChanges();

            // --- Агенты ---
            var agents = new Agent[]
            {
                new Agent { Name = "Jett", Role = "Duelist" },
                new Agent { Name = "Sova", Role = "Initiator" },
                new Agent { Name = "Omen", Role = "Controller" },
                new Agent { Name = "Killjoy", Role = "Sentinel" },
                new Agent { Name = "Raze", Role = "Duelist" }
            };
            context.Agents.AddRange(agents);
            context.SaveChanges();

            // --- Создаём один тестовый дефолт ---
            var fnatic = context.Teams.First(t => t.Name == "Fnatic");
            var ascent = context.Maps.First(m => m.Name == "Ascent");

            var defaultEntity = new Default
            {
                Title = "Fnatic Ascent Attack Default",
                Description = "Стандартный выход на A с контролем Main и Tree",
                TeamId = fnatic.Id,
                MapId = ascent.Id,
                Side = Side.Attack,
                RoundNumber = 1,
                OpponentTeamName = "LOUD",
                YoutubeUrl = "https://youtu.be/example?t=123"
            };
            context.Defaults.Add(defaultEntity);
            context.SaveChanges();

            // --- Шаги для дефолта ---
            var step1 = new DefaultStep
            {
                DefaultId = defaultEntity.Id,
                StepNumber = 1,
                Comment = "Начальная расстановка. Jett и Sova занимают позиции перед выходом."
            };
            var step2 = new DefaultStep
            {
                DefaultId = defaultEntity.Id,
                StepNumber = 2,
                Comment = "Sova кидает разведку в A Main, Omen курит CT и Heaven."
            };
            context.DefaultSteps.AddRange(step1, step2);
            context.SaveChanges();

            // --- Позиции агентов на шагах (координаты в процентах от карты) ---
            var jett = context.Agents.First(a => a.Name == "Jett");
            var sova = context.Agents.First(a => a.Name == "Sova");
            var omen = context.Agents.First(a => a.Name == "Omen");

            var positionsStep1 = new StepPosition[]
            {
                new StepPosition { StepId = step1.Id, AgentId = jett.Id, X = 45, Y = 60 },
                new StepPosition { StepId = step1.Id, AgentId = sova.Id, X = 50, Y = 65 },
                new StepPosition { StepId = step1.Id, AgentId = omen.Id, X = 40, Y = 55 }
            };
            context.StepPositions.AddRange(positionsStep1);
            context.SaveChanges();

            var positionsStep2 = new StepPosition[]
            {
                new StepPosition { StepId = step2.Id, AgentId = jett.Id, X = 55, Y = 60 },
                new StepPosition { StepId = step2.Id, AgentId = sova.Id, X = 52, Y = 62 },
                new StepPosition { StepId = step2.Id, AgentId = omen.Id, X = 48, Y = 58 }
            };
            context.StepPositions.AddRange(positionsStep2);
            context.SaveChanges();
        }
    }
}