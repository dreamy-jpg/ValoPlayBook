namespace ValoPlayBook.Core.Models
{
    public class Agent
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? IconUrl { get; set; }
        public string? Role { get; set; }

        public ICollection<Ability> Abilities { get; set; } = new List<Ability>();
        public ICollection<StepPosition> StepPositions { get; set; } = new List<StepPosition>();
    }
}