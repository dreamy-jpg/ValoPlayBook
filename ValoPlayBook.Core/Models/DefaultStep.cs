namespace ValoPlayBook.Core.Models
{
    public class DefaultStep
    {
        public int Id { get; set; }
        public int DefaultId { get; set; }
        public int StepNumber { get; set; }
        public string Comment { get; set; } = string.Empty;

        public Default Default { get; set; } = null!;
        public ICollection<StepPosition> Positions { get; set; } = new List<StepPosition>();
    }
}