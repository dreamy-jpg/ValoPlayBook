using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValoPlayBook.API.Models.DTOs;
using ValoPlayBook.Data.Data;

namespace ValoPlayBook.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StepPositionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StepPositionsController(AppDbContext context)
        {
            _context = context;
        }

        // PUT: api/StepPositions/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]   // <-- добавлена авторизация
        public async Task<IActionResult> UpdatePosition(int id, UpdatePositionDto dto)
        {
            var position = await _context.StepPositions.FindAsync(id);
            if (position == null)
                return NotFound();

            position.X = dto.X;
            position.Y = dto.Y;
            position.Rotation = dto.Rotation;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/StepPositions/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePosition(int id)
        {
            var position = await _context.StepPositions.FindAsync(id);
            if (position == null)
                return NotFound();

            _context.StepPositions.Remove(position);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/StepPositions/5/replace
        [HttpPut("{id}/replace")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PositionDto>> ReplacePosition(int id, ReplacePositionDto dto)
        {
            var position = await _context.StepPositions
                .Include(p => p.Agent)
                .FirstOrDefaultAsync(p => p.Id == id);
            if (position == null)
                return NotFound("Позиция не найдена");

            var newAgent = await _context.Agents.FindAsync(dto.AgentId);
            if (newAgent == null)
                return BadRequest("Агент не найден");

            var stepHasAgent = await _context.StepPositions
                .AnyAsync(p => p.StepId == position.StepId && p.AgentId == dto.AgentId && p.IsAttacker == position.IsAttacker && p.Id != id);
            if (stepHasAgent)
                return BadRequest("Этот агент уже находится на данной стороне");

            var abilitiesToRemove = await _context.StepAbilities
                .Where(sa => sa.AgentId == position.AgentId && sa.ActivationStepId == position.StepId)
                .ToListAsync();
            _context.StepAbilities.RemoveRange(abilitiesToRemove);

            position.AgentId = dto.AgentId;

            await _context.SaveChangesAsync();

            var dtoResult = new PositionDto
            {
                Id = position.Id,
                AgentId = position.AgentId,
                AgentName = newAgent.Name,
                X = position.X,
                Y = position.Y,
                Rotation = position.Rotation,
                IsAttacker = position.IsAttacker
            };

            return Ok(dtoResult);
        }
    }
}