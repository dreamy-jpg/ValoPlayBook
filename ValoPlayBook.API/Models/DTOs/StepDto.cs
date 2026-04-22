namespace ValoPlayBook.API.Models.DTOs
{
    public class StepDto
    {
        public int Id { get; set; }
        public int StepNumber { get; set; }
        public string Comment { get; set; } = string.Empty;
        public List<PositionDto> Positions { get; set; } = new();
        public List<StepAbilityDto> Abilities { get; set; } = new(); // новое поле
    }
}