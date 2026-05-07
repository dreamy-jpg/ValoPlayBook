using System.ComponentModel.DataAnnotations;

namespace ValoPlayBook.API.Models.DTOs
{
    public class CreatePositionDto
    {
        [Required(ErrorMessage = "Агент обязателен")]
        public int AgentId { get; set; }

        public bool IsAttacker { get; set; }

        [Range(0, 1024, ErrorMessage = "Координата X должна быть от 0 до 1024")]
        public double? X { get; set; }

        [Range(0, 1024, ErrorMessage = "Координата Y должна быть от 0 до 1024")]
        public double? Y { get; set; }
    }
}