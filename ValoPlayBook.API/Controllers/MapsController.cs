using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValoPlayBook.API.Models.DTOs;
using ValoPlayBook.Data.Data;

namespace ValoPlayBook.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MapsController : ControllerBase
{
    private readonly AppDbContext _context;

    public MapsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/maps
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MapDto>>> GetMaps()
    {
        var maps = await _context.Maps
            .Select(m => new MapDto
            {
                Id = m.Id,
                Name = m.Name,
                ImageUrl = m.ImageUrl
            })
            .ToListAsync();

        return Ok(maps);
    }
}