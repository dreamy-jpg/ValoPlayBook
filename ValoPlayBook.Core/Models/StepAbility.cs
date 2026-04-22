namespace ValoPlayBook.Core.Models
{
    public enum AbilityZoneType
    {
        Circle,
        Line,
        Rectangle,
        Cone
    }

    public class StepAbility
    {
        public int Id { get; set; }

        public int ActivationStepId { get; set; }
        public DefaultStep ActivationStep { get; set; } = null!;

        public int AbilityId { get; set; }
        public Ability Ability { get; set; } = null!;

        public int AgentId { get; set; }

        public double? X { get; set; }
        public double? Y { get; set; }
        public double? Rotation { get; set; }

        public AbilityZoneType ZoneType { get; set; } = AbilityZoneType.Circle;

        // Для Circle используется Radius (уже есть)
        public double? Radius { get; set; }

        // Для Line и Rectangle
        public double? Length { get; set; }
        public double? Width { get; set; }

        // Для Cone
        public double? Angle { get; set; }

        public int DurationSteps { get; set; } = 1;
    }
}