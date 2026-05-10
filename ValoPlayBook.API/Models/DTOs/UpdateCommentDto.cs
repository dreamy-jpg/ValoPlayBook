using System.ComponentModel.DataAnnotations;

namespace ValoPlayBook.API.Models.DTOs;

public class UpdateCommentDto
{
    [Required(ErrorMessage = "Комментарий не может быть пустым")]
    [MaxLength(1000, ErrorMessage = "Комментарий не должен превышать 1000 символов")]
    public string Content { get; set; } = string.Empty;
}