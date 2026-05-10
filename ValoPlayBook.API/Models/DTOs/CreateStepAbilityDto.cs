using System.ComponentModel.DataAnnotations;

namespace ValoPlayBook.API.Models.DTOs
{
    public class CreateStepAbilityDto
    {
        [Required(ErrorMessage = "Способность обязательна")]
        public int AbilityId { get; set; }

        [Required(ErrorMessage = "Агент обязателен")]
        public int AgentId { get; set; }

        [Required(ErrorMessage = "Шаг активации обязателен")]
        public int ActivationStepId { get; set; }

        [Range(0, 1024)]
        public double? X { get; set; }

        [Range(0, 1024)]
        public double? Y { get; set; }

        [Range(-180, 180)]
        public double? Rotation { get; set; }
    }
}