namespace ValoPlayBook.Core.Models
{
    public class Ability
    {
        public int Id { get; set; }
        public int AgentId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? IconUrl { get; set; }

        public Agent Agent { get; set; } = null!;
    }
}