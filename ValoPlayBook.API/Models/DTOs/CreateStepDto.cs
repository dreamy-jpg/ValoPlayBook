using System.ComponentModel.DataAnnotations;

namespace ValoPlayBook.API.Models.DTOs
{
    public class CreateStepDto
    {
        [Required(ErrorMessage = "Номер шага обязателен")]
        [Range(1, int.MaxValue, ErrorMessage = "Номер шага должен быть положительным числом")]
        public int StepNumber { get; set; }

        [MaxLength(500, ErrorMessage = "Комментарий к шагу не должен превышать 500 символов")]
        public string Comment { get; set; } = string.Empty;
    }
}