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

        [RegularExpression("Circle|Line|Rectangle|Cone", ErrorMessage = "Тип зоны должен быть Circle, Line, Rectangle или Cone")]
        public string ZoneType { get; set; } = "Circle";

        [Range(1, 500)]
        public double? Radius { get; set; }

        [Range(1, 1000)]
        public double? Length { get; set; }

        [Range(1, 500)]
        public double? Width { get; set; }

        [Range(1, 180)]
        public double? Angle { get; set; }

        [Range(1, 10, ErrorMessage = "Длительность должна быть от 1 до 10 шагов")]
        public int DurationSteps { get; set; } = 1;
    }
}