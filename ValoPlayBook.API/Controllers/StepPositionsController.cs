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
    }
}