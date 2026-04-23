using System.Linq;
using ValoPlayBook.Core.Models;

namespace ValoPlayBook.Data.Data
{
    public static partial class DbInitializer
    {
        private static void SeedMaps(AppDbContext context)
        {
            if (!context.Maps.Any(m => m.Name == "Abyss"))
                context.Maps.Add(new Map { Name = "Abyss" });

            if (!context.Maps.Any(m => m.Name == "Ascent"))
                context.Maps.Add(new Map { Name = "Ascent" });

            if (!context.Maps.Any(m => m.Name == "Bind"))
                context.Maps.Add(new Map { Name = "Bind" });

            if (!context.Maps.Any(m => m.Name == "Breeze"))
                context.Maps.Add(new Map { Name = "Breeze" });

            if (!context.Maps.Any(m => m.Name == "Corrode"))
                context.Maps.Add(new Map { Name = "Corrode" });

            if (!context.Maps.Any(m => m.Name == "Fracture"))
                context.Maps.Add(new Map { Name = "Fracture" });

            if (!context.Maps.Any(m => m.Name == "Haven"))
                context.Maps.Add(new Map { Name = "Haven" });

            if (!context.Maps.Any(m => m.Name == "Icebox"))
                context.Maps.Add(new Map { Name = "Icebox" });

            if (!context.Maps.Any(m => m.Name == "Lotus"))
                context.Maps.Add(new Map { Name = "Lotus" });

            if (!context.Maps.Any(m => m.Name == "Pearl"))
                context.Maps.Add(new Map { Name = "Pearl" });

            if (!context.Maps.Any(m => m.Name == "Split"))
                context.Maps.Add(new Map { Name = "Split" });

            if (!context.Maps.Any(m => m.Name == "Sunset"))
                context.Maps.Add(new Map { Name = "Sunset" });
        }
    }
}