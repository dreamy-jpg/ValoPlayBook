using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValoPlayBook.API.Helpers;
using ValoPlayBook.API.Models;
using ValoPlayBook.API.Models.DTOs;
using ValoPlayBook.Core.Enums;
using ValoPlayBook.Core.Models;
using ValoPlayBook.Data.Data;
using System.Linq;

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

        [HttpGet]
        public async Task<ActionResult<PagedResult<DefaultListItemDto>>> GetDefaults(
            [FromQuery] int? mapId,
            [FromQuery] int? teamId,
            [FromQuery] Side? side,
            [FromQuery] int? createdByUserId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 50) pageSize = 50;

            var query = _context.Defaults
                .Include(d => d.Team)
                .Include(d => d.Map)
                .AsQueryable();

            if (mapId.HasValue)
                query = query.Where(d => d.MapId == mapId.Value);
            if (teamId.HasValue)
                query = query.Where(d => d.TeamId == teamId.Value);
            if (side.HasValue)
                query = query.Where(d => d.Side == side.Value);
            if (createdByUserId.HasValue)
                query = query.Where(d => d.CreatedByUserId == createdByUserId.Value);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(d => d.CreatedAt)
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
                    StepCount = d.Steps.Count,
                    CreatedByUserId = d.CreatedByUserId,
                    ImageUrl = d.ImageUrl
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

        [HttpGet("{id}")]
        public async Task<ActionResult<DefaultDto>> GetDefault(int id)
        {
            var defaultEntity = await _context.Defaults
                .Include(d => d.Team)
                .Include(d => d.Map)
                .Include(d => d.CreatedByUser) // <-- добавлено
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

            return Ok(MappingHelper.MapToDto(defaultEntity));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DefaultDto>> CreateDefault(CreateDefaultDto dto)
        {
            var team = await _context.Teams.FindAsync(dto.TeamId);
            if (team == null) return BadRequest("Команда не найдена");
            var map = await _context.Maps.FindAsync(dto.MapId);
            if (map == null) return BadRequest("Карта не найдена");
            if (!Enum.TryParse<Side>(dto.Side, out var side))
                return BadRequest("Некорректная сторона (допустимо Attack, Defense)");

            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            int? userId = null;
            if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out var parsedUserId))
                userId = parsedUserId;

            var defaultEntity = new Core.Models.Default
            {
                Title = dto.Title,
                Description = dto.Description,
                TeamId = dto.TeamId,
                MapId = dto.MapId,
                Side = side,
                RoundNumber = dto.RoundNumber,
                OpponentTeamName = dto.OpponentTeamName,
                YoutubeUrl = dto.YoutubeUrl,
                ImageUrl = dto.ImageUrl,
                CreatedByUserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Defaults.Add(defaultEntity);
            await _context.SaveChangesAsync();

            var created = await _context.Defaults
                .Include(d => d.Team)
                .Include(d => d.Map)
                .FirstAsync(d => d.Id == defaultEntity.Id);

            return CreatedAtAction(nameof(GetDefault), new { id = created.Id }, MappingHelper.MapToDto(created));
        }

        [HttpPost("{defaultId}/steps")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<StepDto>> CreateStep(int defaultId, CreateStepDto dto)
        {
            var defaultEntity = await _context.Defaults
                .Include(d => d.Steps)
                .FirstOrDefaultAsync(d => d.Id == defaultId);
            if (defaultEntity == null)
                return NotFound("Тактика не найдена");

            if (defaultEntity.Steps.Any(s => s.StepNumber == dto.StepNumber))
                return BadRequest("Шаг с таким номером уже существует в этой тактике");

            var step = new DefaultStep
            {
                DefaultId = defaultId,
                StepNumber = dto.StepNumber,
                Comment = dto.Comment ?? string.Empty
            };

            _context.DefaultSteps.Add(step);
            await _context.SaveChangesAsync();

            var stepDto = new StepDto
            {
                Id = step.Id,
                StepNumber = step.StepNumber,
                Comment = step.Comment,
                Positions = new List<PositionDto>(),
                Abilities = new List<StepAbilityDto>()
            };

            return CreatedAtAction(nameof(GetDefault), new { id = defaultId }, stepDto);
        }

        [HttpDelete("{defaultId}/steps/{stepId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStep(int defaultId, int stepId)
        {
            var step = await _context.DefaultSteps
                .FirstOrDefaultAsync(s => s.Id == stepId && s.DefaultId == defaultId);
            if (step == null)
                return NotFound("Шаг не найден");

            _context.DefaultSteps.Remove(step);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{defaultId}/steps/{stepId}/positions")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PositionDto>> CreatePosition(int defaultId, int stepId, CreatePositionDto dto)
        {
            var step = await _context.DefaultSteps
                .Include(s => s.Positions)
                .FirstOrDefaultAsync(s => s.Id == stepId && s.DefaultId == defaultId);
            if (step == null)
                return NotFound("Шаг не найден");

            var sameSideCount = step.Positions.Count(p => p.IsAttacker == dto.IsAttacker);
            if (sameSideCount >= 5)
                return BadRequest($"На стороне {(dto.IsAttacker ? "атаки" : "защиты")} уже максимум агентов (5)");

            if (step.Positions.Any(p => p.AgentId == dto.AgentId))
                return BadRequest("Этот агент уже находится на данном шаге");

            var agent = await _context.Agents.FindAsync(dto.AgentId);
            if (agent == null)
                return BadRequest("Агент не найден");

            var position = new StepPosition
            {
                StepId = stepId,
                AgentId = dto.AgentId,
                X = dto.X ?? 512,
                Y = dto.Y ?? 512,
                IsAttacker = dto.IsAttacker,
                Rotation = null
            };

            _context.StepPositions.Add(position);
            await _context.SaveChangesAsync();

            var positionDto = new PositionDto
            {
                Id = position.Id,
                AgentId = position.AgentId,
                AgentName = agent.Name,
                X = position.X,
                Y = position.Y,
                Rotation = position.Rotation,
                IsAttacker = position.IsAttacker
            };

            return CreatedAtAction(nameof(GetDefault), new { id = defaultId }, positionDto);
        }

        [HttpPut("{defaultId}/steps/{stepId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStep(int defaultId, int stepId, UpdateStepDto dto)
        {
            var step = await _context.DefaultSteps
                .FirstOrDefaultAsync(s => s.Id == stepId && s.DefaultId == defaultId);
            if (step == null) return NotFound("Шаг не найден");

            step.Comment = dto.Comment ?? step.Comment;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteDefault(int id)
        {
            var defaultEntity = await _context.Defaults.FindAsync(id);
            if (defaultEntity == null) return NotFound();

            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var currentUserId))
                return Unauthorized();

            bool isAdmin = User.IsInRole("Admin");
            if (!isAdmin && defaultEntity.CreatedByUserId != currentUserId)
                return Forbid();

            _context.Defaults.Remove(defaultEntity);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{id}/image")]
        [Authorize]
        public async Task<IActionResult> UploadImage(int id, IFormFile file)
        {
            var defaultEntity = await _context.Defaults.FindAsync(id);
            if (defaultEntity == null) return NotFound();

            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var currentUserId))
                return Unauthorized();
            bool isAdmin = User.IsInRole("Admin");
            if (!isAdmin && defaultEntity.CreatedByUserId != currentUserId)
                return Forbid();

            if (file == null || file.Length == 0)
                return BadRequest("Файл не выбран");

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(ext))
                return BadRequest("Недопустимый формат файла. Разрешены: jpg, png, gif, webp");

            if (file.Length > 5 * 1024 * 1024) // 5 MB
                return BadRequest("Файл не должен превышать 5 МБ");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "defaults");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{id}_{DateTime.Now.Ticks}{ext}";
            var filePath = Path.Combine(uploadsFolder, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            if (!string.IsNullOrEmpty(defaultEntity.ImageUrl))
            {
                var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", defaultEntity.ImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(oldFilePath))
                    System.IO.File.Delete(oldFilePath);
            }

            defaultEntity.ImageUrl = $"/uploads/defaults/{fileName}";
            await _context.SaveChangesAsync();

            return Ok(new { imageUrl = defaultEntity.ImageUrl });
        }
    }
}