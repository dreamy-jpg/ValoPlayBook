namespace ValoPlayBook.API.Models.DTOs
{
    public class StepAbilityDto
    {
        public int Id { get; set; }
        public int ActivationStepId { get; set; }
        public int AbilityId { get; set; }
        public string AbilityName { get; set; } = string.Empty;
        public int AgentId { get; set; }
        public string AgentName { get; set; } = string.Empty;
        public double? X { get; set; }
        public double? Y { get; set; }
        public double? Rotation { get; set; }

        // Эти поля будут браться из Ability
        public string ZoneType { get; set; } = "Circle";
        public double? Radius { get; set; }
        public double? Length { get; set; }
        public double? Width { get; set; }
        public double? Angle { get; set; }
        public int DurationSteps { get; set; }
    }
}