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
    }
}