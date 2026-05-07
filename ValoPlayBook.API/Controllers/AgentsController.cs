using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValoPlayBook.Data.Data;

namespace ValoPlayBook.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AgentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AgentsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/agents
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAgents()
    {
        var agents = await _context.Agents
            .Include(a => a.Abilities)
            .Select(a => new
            {
                a.Id,
                a.Name,
                a.Role,
                a.IconUrl,
                Abilities = a.Abilities.Select(ab => new
                {
                    ab.Id,
                    ab.Name,
                    ab.Type,
                    ab.MaxCharges,
                    ab.IconUrl
                }).ToList()
            })
            .ToListAsync();

        return Ok(agents);
    }
}