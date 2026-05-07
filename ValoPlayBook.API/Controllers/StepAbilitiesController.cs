using Microsoft.AspNetCore.Authorization;
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

        // PUT: api/stepabilities/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]   // <-- добавлена авторизация
        public async Task<IActionResult> UpdateStepAbility(int id, UpdateStepAbilityDto dto)
        {
            var stepAbility = await _context.StepAbilities.FindAsync(id);
            if (stepAbility == null)
                return NotFound();

            stepAbility.X = dto.X;
            stepAbility.Y = dto.Y;
            stepAbility.Rotation = dto.Rotation;
            stepAbility.DurationSteps = dto.DurationSteps;

            if (!string.IsNullOrEmpty(dto.ZoneType) && Enum.TryParse<AbilityZoneType>(dto.ZoneType, out var zoneType))
                stepAbility.ZoneType = zoneType;

            stepAbility.Radius = dto.Radius;
            stepAbility.Length = dto.Length;
            stepAbility.Width = dto.Width;
            stepAbility.Angle = dto.Angle;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/stepabilities
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<StepAbilityDto>> CreateStepAbility(CreateStepAbilityDto dto)
        {
            var ability = await _context.Abilities
                .Include(a => a.Agent)
                .FirstOrDefaultAsync(a => a.Id == dto.AbilityId);
            if (ability == null)
                return BadRequest("Способность не найдена");

            // Проверка, что способность принадлежит указанному агенту
            if (ability.AgentId != dto.AgentId)
                return BadRequest("Способность не принадлежит данному агенту");

            var activationStep = await _context.DefaultSteps
                .Include(s => s.StepAbilities)
                .FirstOrDefaultAsync(s => s.Id == dto.ActivationStepId);
            if (activationStep == null)
                return BadRequest("Шаг активации не найден");

            int currentUses = activationStep.StepAbilities.Count(sa => sa.AbilityId == dto.AbilityId);
            if (currentUses >= ability.MaxCharges)
                return BadRequest($"Достигнут лимит использований способности ({ability.MaxCharges})");

            var stepAbility = new StepAbility
            {
                AbilityId = dto.AbilityId,
                AgentId = dto.AgentId,
                ActivationStepId = dto.ActivationStepId,
                X = dto.X ?? 512,
                Y = dto.Y ?? 512,
                Rotation = dto.Rotation,
                DurationSteps = dto.DurationSteps,
                ZoneType = Enum.TryParse<AbilityZoneType>(dto.ZoneType, out var zoneType) ? zoneType : AbilityZoneType.Circle,
                Radius = dto.Radius,
                Length = dto.Length,
                Width = dto.Width,
                Angle = dto.Angle
            };

            _context.StepAbilities.Add(stepAbility);
            await _context.SaveChangesAsync();

            var dtoResult = new StepAbilityDto
            {
                Id = stepAbility.Id,
                ActivationStepId = stepAbility.ActivationStepId,
                AbilityId = stepAbility.AbilityId,
                AbilityName = ability.Name,
                AgentId = stepAbility.AgentId,
                AgentName = ability.Agent?.Name ?? "Unknown",
                X = stepAbility.X,
                Y = stepAbility.Y,
                Rotation = stepAbility.Rotation,
                ZoneType = stepAbility.ZoneType.ToString(),
                Radius = stepAbility.Radius,
                Length = stepAbility.Length,
                Width = stepAbility.Width,
                Angle = stepAbility.Angle,
                DurationSteps = stepAbility.DurationSteps
            };

            return CreatedAtAction(nameof(UpdateStepAbility), new { id = stepAbility.Id }, dtoResult);
        }

        // DELETE: api/stepabilities/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStepAbility(int id)
        {
            var stepAbility = await _context.StepAbilities.FindAsync(id);
            if (stepAbility == null)
                return NotFound();

            _context.StepAbilities.Remove(stepAbility);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}