namespace ValoPlayBook.Core.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public int DefaultId { get; set; }

        // Связь с зарегистрированным пользователем (может быть null для анонимных)
        public int? UserId { get; set; }
        public User? User { get; set; }

        // Оставляем поля для анонимных комментариев (заполняются только если UserId == null)
        public string? AuthorName { get; set; }
        public string? AuthorEmail { get; set; }

        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Default Default { get; set; } = null!;
    }
}