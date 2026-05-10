namespace ValoPlayBook.API.Models.DTOs
{
    public class AbilityDto
    {
        public int Id { get; set; }
        public int AgentId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string? IconUrl { get; set; }
        public int MaxCharges { get; set; }

        public string ZoneType { get; set; } = "Circle";
        public double? DefaultRadius { get; set; }
        public double? DefaultLength { get; set; }
        public double? DefaultWidth { get; set; }
        public double? DefaultAngle { get; set; }
        public int DefaultDurationSteps { get; set; }
    }
}