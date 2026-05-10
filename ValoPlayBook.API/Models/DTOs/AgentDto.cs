namespace ValoPlayBook.API.Models.DTOs
{
    public class AgentDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? IconUrl { get; set; }
        public List<AbilityDto> Abilities { get; set; } = new();
    }
}