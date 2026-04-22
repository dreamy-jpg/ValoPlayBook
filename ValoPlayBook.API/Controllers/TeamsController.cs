using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValoPlayBook.API.Models.DTOs;
using ValoPlayBook.Data.Data;

namespace ValoPlayBook.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TeamsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TeamsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/teams
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeamDto>>> GetTeams()
    {
        var teams = await _context.Teams
            .Select(t => new TeamDto
            {
                Id = t.Id,
                Name = t.Name,
                LogoUrl = t.LogoUrl
            })
            .ToListAsync();

        return Ok(teams);
    }
}