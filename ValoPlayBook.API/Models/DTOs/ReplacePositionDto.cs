using System.ComponentModel.DataAnnotations;

namespace ValoPlayBook.API.Models.DTOs
{
    public class ReplacePositionDto
    {
        [Required(ErrorMessage = "Агент обязателен")]
        public int AgentId { get; set; }
    }
}