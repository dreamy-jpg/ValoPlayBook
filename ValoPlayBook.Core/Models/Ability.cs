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

        // Новое поле: максимальное количество зарядов (например, 1 для ульты, 2 для флешек Phoenix)
        public int MaxCharges { get; set; } = 1;

        public Agent Agent { get; set; } = null!;
    }
}