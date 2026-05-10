using ValoPlayBook.Core.Enums;

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
        public int MaxCharges { get; set; } = 1;

        public AbilityZoneType ZoneType { get; set; } = AbilityZoneType.Circle;
        public double? DefaultRadius { get; set; }
        public double? DefaultLength { get; set; }
        public double? DefaultWidth { get; set; }
        public double? DefaultAngle { get; set; }
        public int DefaultDurationSteps { get; set; } = 1;

        public Agent Agent { get; set; } = null!;
    }
}