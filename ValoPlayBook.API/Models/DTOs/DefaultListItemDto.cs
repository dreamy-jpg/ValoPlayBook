namespace ValoPlayBook.API.Models.DTOs
{
    public class DefaultListItemDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public TeamDto Team { get; set; } = null!;
        public MapDto Map { get; set; } = null!;
        public string Side { get; set; } = string.Empty;
        public int? RoundNumber { get; set; }
        public string? OpponentTeamName { get; set; }
        public string? YoutubeUrl { get; set; }
        public int StepCount { get; set; } // количество шагов (для отображения)
    }
}