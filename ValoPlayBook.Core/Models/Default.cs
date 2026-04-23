using System.Xml.Linq;
using ValoPlayBook.Core.Enums;

namespace ValoPlayBook.Core.Models
{
    public class Default
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }

        public int TeamId { get; set; }
        public int MapId { get; set; }
        public Side Side { get; set; }

        public int? RoundNumber { get; set; }
        public string? OpponentTeamName { get; set; }
        public string? YoutubeUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? CreatedByUserId { get; set; }
        public User? CreatedByUser { get; set; }

        public Team Team { get; set; } = null!;
        public Map Map { get; set; } = null!;
        public ICollection<DefaultStep> Steps { get; set; } = new List<DefaultStep>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}