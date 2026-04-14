namespace ValoPlayBook.Core.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public int DefaultId { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string? AuthorEmail { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Default Default { get; set; } = null!;
    }
}