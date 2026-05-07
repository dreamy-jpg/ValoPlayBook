using System.ComponentModel.DataAnnotations;

namespace ValoPlayBook.API.Models.DTOs;

public class CommentDto
{
    public int Id { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string? AuthorEmail { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int? UserId { get; set; }
}

public class CreateCommentDto
{
    public string AuthorName { get; set; } = string.Empty;

    [EmailAddress(ErrorMessage = "Некорректный Email")]
    public string? AuthorEmail { get; set; }

    [Required(ErrorMessage = "Комментарий не может быть пустым")]
    [MaxLength(1000, ErrorMessage = "Комментарий не должен превышать 1000 символов")]
    public string Content { get; set; } = string.Empty;
}