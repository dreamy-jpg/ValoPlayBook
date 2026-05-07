using System.ComponentModel.DataAnnotations;

namespace ValoPlayBook.API.Models.DTOs
{
    public class UpdateStepAbilityDto
    {
        [Range(0, 1024)]
        public double? X { get; set; }

        [Range(0, 1024)]
        public double? Y { get; set; }

        [Range(-180, 180)]
        public double? Rotation { get; set; }

        [RegularExpression("Circle|Line|Rectangle|Cone")]
        public string? ZoneType { get; set; }

        [Range(1, 500)]
        public double? Radius { get; set; }

        [Range(1, 1000)]
        public double? Length { get; set; }

        [Range(1, 500)]
        public double? Width { get; set; }

        [Range(1, 180)]
        public double? Angle { get; set; }

        [Range(1, 10)]
        public int DurationSteps { get; set; }
    }
}