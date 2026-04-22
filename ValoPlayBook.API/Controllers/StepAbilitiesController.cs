using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValoPlayBook.API.Models.DTOs;
using ValoPlayBook.Core.Models;
using ValoPlayBook.Data.Data;

namespace ValoPlayBook.API.Controllers
{
    [ApiController]
    [Route("api/stepabilities")]
    public class StepAbilitiesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StepAbilitiesController(AppDbContext context)
        {
            _context = context;
        }

        // PUT: api/StepAbilities/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStepAbility(int id, UpdateStepAbilityDto dto)
        {
            var stepAbility = await _context.StepAbilities.FindAsync(id);
            if (stepAbility == null)
                return NotFound();

            stepAbility.X = dto.X;
            stepAbility.Y = dto.Y;
            stepAbility.Rotation = dto.Rotation;
            stepAbility.DurationSteps = dto.DurationSteps;

            // Обработка типа зоны
            if (!string.IsNullOrEmpty(dto.ZoneType) && Enum.TryParse<AbilityZoneType>(dto.ZoneType, out var zoneType))
                stepAbility.ZoneType = zoneType;

            // Параметры для разных типов зон
            stepAbility.Radius = dto.Radius;
            stepAbility.Length = dto.Length;
            stepAbility.Width = dto.Width;
            stepAbility.Angle = dto.Angle;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}