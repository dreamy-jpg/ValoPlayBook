using System.ComponentModel.DataAnnotations;

namespace ValoPlayBook.API.Models.DTOs
{
    public class UpdateStepDto
    {
        [MaxLength(500, ErrorMessage = "Комментарий к шагу не должен превышать 500 символов")]
        public string? Comment { get; set; }
    }
}