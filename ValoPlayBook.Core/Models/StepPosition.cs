namespace ValoPlayBook.Core.Models
{
    public class StepPosition
    {
        public int Id { get; set; }
        public int StepId { get; set; }
        public int AgentId { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        public double? Rotation { get; set; }

        // Новое поле: true = атакующий, false = защитник
        public bool IsAttacker { get; set; }

        public DefaultStep Step { get; set; } = null!;
        public Agent Agent { get; set; } = null!;
    }
}