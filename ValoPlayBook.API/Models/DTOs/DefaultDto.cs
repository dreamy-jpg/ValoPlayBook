namespace ValoPlayBook.API.Models.DTOs
{
    public class DefaultDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public TeamDto Team { get; set; } = new();
        public MapDto Map { get; set; } = new();
        public string Side { get; set; } = string.Empty;
        public int? RoundNumber { get; set; }
        public string? OpponentTeamName { get; set; }
        public string? YoutubeUrl { get; set; }
        public string? ImageUrl { get; set; }
        public int? CreatedByUserId { get; set; }
        public string? CreatedByUserName { get; set; }
        public string? CreatedByUserAvatar { get; set; }
        public List<StepDto> Steps { get; set; } = new();
    }
}