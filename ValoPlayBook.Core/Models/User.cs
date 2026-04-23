using System.ComponentModel.DataAnnotations;

namespace ValoPlayBook.Core.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = "User";

        public string? AvatarUrl { get; set; } // <-- добавлено для аватара

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Default> CreatedDefaults { get; set; } = new List<Default>();
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}