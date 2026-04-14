namespace ValoPlayBook.Core.Models
{
    public class Map
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? SvgContent { get; set; }

        public ICollection<Default> Defaults { get; set; } = new List<Default>();
    }
}