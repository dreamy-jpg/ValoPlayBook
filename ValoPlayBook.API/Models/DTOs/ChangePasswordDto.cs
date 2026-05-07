using System.ComponentModel.DataAnnotations;

namespace ValoPlayBook.API.Models.DTOs
{
    public class ChangePasswordDto
    {
        [Required(ErrorMessage = "Текущий пароль обязателен")]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Новый пароль обязателен")]
        [MinLength(6, ErrorMessage = "Новый пароль должен содержать минимум 6 символов")]
        public string NewPassword { get; set; } = string.Empty;
    }
}