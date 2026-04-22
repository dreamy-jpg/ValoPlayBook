namespace ValoPlayBook.API.Models.DTOs
{
    public class UpdateStepAbilityDto
    {
        public double? X { get; set; }
        public double? Y { get; set; }
        public double? Rotation { get; set; }

        public string? ZoneType { get; set; }
        public double? Radius { get; set; }
        public double? Length { get; set; }
        public double? Width { get; set; }
        public double? Angle { get; set; }

        public int DurationSteps { get; set; }
    }
}