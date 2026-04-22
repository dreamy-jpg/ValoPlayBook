using ValoPlayBook.Core.Models;

namespace ValoPlayBook.Data.Data
{
    public static partial class DbInitializer
    {
        private static void SeedMaps(AppDbContext context)
        {
            var maps = new Map[]
            {
                new Map { Name = "Ascent" },
                new Map { Name = "Bind" },
                new Map { Name = "Haven" }
            };
            context.Maps.AddRange(maps);
            context.SaveChanges();
        }
    }
}