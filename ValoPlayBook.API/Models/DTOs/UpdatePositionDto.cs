using System.ComponentModel.DataAnnotations;

namespace ValoPlayBook.API.Models.DTOs
{
    public class UpdatePositionDto
    {
        [Required]
        [Range(0, 1024)]
        public double X { get; set; }

        [Required]
        [Range(0, 1024)]
        public double Y { get; set; }

        [Range(-180, 180)]
        public double? Rotation { get; set; }
    }
}