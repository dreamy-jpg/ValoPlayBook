using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValoPlayBook.API.Models.DTOs;
using ValoPlayBook.Data.Data;

namespace ValoPlayBook.API.Controllers
{
    [ApiController]
    [Route("api/agents")]
    public class AgentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AgentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AgentDto>>> GetAgents()
        {
            var agents = await _context.Agents
                .Include(a => a.Abilities)
                .Select(a => new AgentDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Role = a.Role,
                    IconUrl = a.IconUrl,
                    Abilities = a.Abilities.Select(ab => new AbilityDto
                    {
                        Id = ab.Id,
                        AgentId = ab.AgentId,
                        Name = ab.Name,
                        Type = ab.Type,
                        IconUrl = ab.IconUrl,
                        MaxCharges = ab.MaxCharges,
                        ZoneType = ab.ZoneType.ToString(),
                        DefaultRadius = ab.DefaultRadius,
                        DefaultLength = ab.DefaultLength,
                        DefaultWidth = ab.DefaultWidth,
                        DefaultAngle = ab.DefaultAngle,
                        DefaultDurationSteps = ab.DefaultDurationSteps
                    }).ToList()
                })
                .ToListAsync();

            return Ok(agents);
        }
    }
}