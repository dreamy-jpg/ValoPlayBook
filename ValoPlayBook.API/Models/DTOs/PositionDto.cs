namespace ValoPlayBook.API.Models.DTOs
{
    public class PositionDto
    {
        public int AgentId { get; set; }
        public string AgentName { get; set; } = string.Empty;
        public double X { get; set; }
        public double Y { get; set; }
        public double? Rotation { get; set; }
    }
}