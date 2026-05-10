namespace ValoPlayBook.Core.Models
{
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

        // Все поля геометрии удалены, они теперь в Ability
    }
}