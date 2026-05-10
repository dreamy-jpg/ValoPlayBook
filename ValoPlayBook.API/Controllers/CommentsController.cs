using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ValoPlayBook.API.Models;
using ValoPlayBook.API.Models.DTOs;
using ValoPlayBook.Core.Models;
using ValoPlayBook.Data.Data;

namespace ValoPlayBook.API.Controllers;

[Route("api/defaults/{defaultId}/[controller]")]
[ApiController]
public class CommentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CommentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<CommentDto>>> GetComments(
        int defaultId,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 50) pageSize = 50;

        var query = _context.Comments
            .Where(c => c.DefaultId == defaultId)
            .OrderByDescending(c => c.CreatedAt);

        var totalCount = await query.CountAsync();

        var comments = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                AuthorName = c.AuthorName ?? "Аноним",
                AuthorEmail = c.AuthorEmail,
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                UserId = c.UserId
            })
            .ToListAsync();

        var result = new PagedResult<CommentDto>
        {
            Items = comments,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };

        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<CommentDto>> PostComment(int defaultId, CreateCommentDto createDto)
    {
        var defaultExists = await _context.Defaults.AnyAsync(d => d.Id == defaultId);
        if (!defaultExists)
            return NotFound($"Default with id {defaultId} not found");

        var comment = new Comment
        {
            DefaultId = defaultId,
            AuthorName = createDto.AuthorName,
            AuthorEmail = createDto.AuthorEmail,
            Content = createDto.Content,
            CreatedAt = DateTime.UtcNow
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        var commentDto = new CommentDto
        {
            Id = comment.Id,
            AuthorName = comment.AuthorName,
            AuthorEmail = comment.AuthorEmail,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            UserId = comment.UserId
        };

        return CreatedAtAction(nameof(GetComments), new { defaultId }, commentDto);
    }

    [HttpDelete("{commentId}")]
    [Authorize]
    public async Task<IActionResult> DeleteComment(int defaultId, int commentId)
    {
        var comment = await _context.Comments
            .FirstOrDefaultAsync(c => c.Id == commentId && c.DefaultId == defaultId);

        if (comment == null)
            return NotFound();

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var isAdmin = User.IsInRole("Admin");
        if (!isAdmin && (comment.UserId == null || comment.UserId != userId))
            return Forbid();

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Новый метод: редактирование комментария
    [HttpPut("{commentId}")]
    [Authorize]
    public async Task<IActionResult> UpdateComment(int defaultId, int commentId, UpdateCommentDto dto)
    {
        var comment = await _context.Comments
            .FirstOrDefaultAsync(c => c.Id == commentId && c.DefaultId == defaultId);
        if (comment == null) return NotFound();

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var isAdmin = User.IsInRole("Admin");
        // Редактировать может админ или автор комментария (если UserId != null и совпадает)
        if (!isAdmin && (comment.UserId == null || comment.UserId != userId))
            return Forbid();

        comment.Content = dto.Content;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}