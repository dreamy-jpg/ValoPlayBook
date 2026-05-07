using System.ComponentModel.DataAnnotations;

namespace ValoPlayBook.API.Models.DTOs
{
    public class CreateDefaultDto
    {
        [Required(ErrorMessage = "Название тактики обязательно")]
        [MaxLength(200, ErrorMessage = "Название тактики не должно превышать 200 символов")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Команда обязательна")]
        public int TeamId { get; set; }

        [Required(ErrorMessage = "Карта обязательна")]
        public int MapId { get; set; }

        [Required(ErrorMessage = "Сторона обязательна")]
        [RegularExpression("Attack|Defense", ErrorMessage = "Сторона должна быть Attack или Defense")]
        public string Side { get; set; } = "Attack";

        [MaxLength(500, ErrorMessage = "Описание не должно превышать 500 символов")]
        public string? Description { get; set; }

        [Range(1, 99, ErrorMessage = "Номер раунда должен быть от 1 до 99")]
        public int? RoundNumber { get; set; }

        [MaxLength(100, ErrorMessage = "Название команды противника не должно превышать 100 символов")]
        public string? OpponentTeamName { get; set; }

        [Url(ErrorMessage = "Некорректная ссылка YouTube")]
        public string? YoutubeUrl { get; set; }

        [Url(ErrorMessage = "Некорректная ссылка на изображение")]
        public string? ImageUrl { get; set; }
    }
}