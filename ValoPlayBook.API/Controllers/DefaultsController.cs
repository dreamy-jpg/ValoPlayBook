using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValoPlayBook.API.Models;
using ValoPlayBook.API.Models.DTOs;
using ValoPlayBook.Core.Enums;
using ValoPlayBook.Data.Data;

namespace ValoPlayBook.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DefaultsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DefaultsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/defaults?mapId=1&teamId=1&side=Attack&roundNumber=1
        [HttpGet]
        public async Task<ActionResult<PagedResult<DefaultListItemDto>>> GetDefaults(
            [FromQuery] int? mapId,
            [FromQuery] int? teamId,
            [FromQuery] Side? side,
            [FromQuery] int? roundNumber,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 50) pageSize = 50; // ограничение

            var query = _context.Defaults
                .Include(d => d.Team)
                .Include(d => d.Map)
                .Include(d => d.Steps) // нужно только для подсчёта количества шагов
                .AsQueryable();

            if (mapId.HasValue)
                query = query.Where(d => d.MapId == mapId.Value);

            if (teamId.HasValue)
                query = query.Where(d => d.TeamId == teamId.Value);

            if (side.HasValue)
                query = query.Where(d => d.Side == side.Value);

            if (roundNumber.HasValue)
                query = query.Where(d => d.RoundNumber == roundNumber.Value);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(d => d.CreatedAt) // или по Id
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(d => new DefaultListItemDto
                {
                    Id = d.Id,
                    Title = d.Title,
                    Description = d.Description,
                    Team = new TeamDto { Id = d.Team.Id, Name = d.Team.Name, LogoUrl = d.Team.LogoUrl },
                    Map = new MapDto { Id = d.Map.Id, Name = d.Map.Name, ImageUrl = d.Map.ImageUrl },
                    Side = d.Side.ToString(),
                    RoundNumber = d.RoundNumber,
                    OpponentTeamName = d.OpponentTeamName,
                    YoutubeUrl = d.YoutubeUrl,
                    StepCount = d.Steps.Count
                })
                .ToListAsync();

            var result = new PagedResult<DefaultListItemDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            return Ok(result);
        }

        // GET: api/defaults/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DefaultDto>> GetDefault(int id)
        {
            var defaultEntity = await _context.Defaults
                .Include(d => d.Team)
                .Include(d => d.Map)
                .Include(d => d.Steps)
                    .ThenInclude(s => s.Positions)
                        .ThenInclude(p => p.Agent)
                .Include(d => d.Steps)
                    .ThenInclude(s => s.StepAbilities)
                        .ThenInclude(sa => sa.Ability)
                            .ThenInclude(a => a.Agent)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (defaultEntity == null)
                return NotFound();

            return Ok(MapToDto(defaultEntity));
        }

        // Вспомогательный метод маппинга (можно вынести в отдельный сервис позже)
        private static DefaultDto MapToDto(Core.Models.Default entity)
        {
            return new DefaultDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Description = entity.Description,
                Team = new TeamDto
                {
                    Id = entity.Team.Id,
                    Name = entity.Team.Name,
                    LogoUrl = entity.Team.LogoUrl
                },
                Map = new MapDto
                {
                    Id = entity.Map.Id,
                    Name = entity.Map.Name,
                    ImageUrl = entity.Map.ImageUrl
                },
                Side = entity.Side.ToString(),
                RoundNumber = entity.RoundNumber,
                OpponentTeamName = entity.OpponentTeamName,
                YoutubeUrl = entity.YoutubeUrl,
                Steps = entity.Steps.OrderBy(s => s.StepNumber).Select(s => new StepDto
                {
                    Id = s.Id,
                    StepNumber = s.StepNumber,
                    Comment = s.Comment,
                    Positions = s.Positions.Select(p => new PositionDto
                    {
                        Id = p.Id,
                        AgentId = p.AgentId,
                        AgentName = p.Agent.Name,
                        X = p.X,
                        Y = p.Y,
                        Rotation = p.Rotation,
                        IsAttacker = p.IsAttacker
                    }).ToList(),
                    Abilities = s.StepAbilities.Select(sa => new StepAbilityDto
                    {
                        Id = sa.Id,
                        ActivationStepId = sa.ActivationStepId,
                        AbilityId = sa.AbilityId,
                        AbilityName = sa.Ability?.Name ?? "Unknown",
                        AgentId = sa.AgentId,
                        AgentName = sa.Ability?.Agent?.Name ?? "Unknown",
                        X = sa.X,
                        Y = sa.Y,
                        Rotation = sa.Rotation,
                        ZoneType = sa.ZoneType.ToString(),
                        Radius = sa.Radius,
                        Length = sa.Length,
                        Width = sa.Width,
                        Angle = sa.Angle,
                        DurationSteps = sa.DurationSteps
                    }).ToList()
                }).ToList()
            };
        }
    }
}