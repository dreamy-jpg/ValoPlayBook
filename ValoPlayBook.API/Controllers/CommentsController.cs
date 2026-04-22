using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

    // GET: api/defaults/1/comments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CommentDto>>> GetComments(int defaultId)
    {
        var comments = await _context.Comments
            .Where(c => c.DefaultId == defaultId)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                AuthorName = c.AuthorName,
                AuthorEmail = c.AuthorEmail,
                Content = c.Content,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        return Ok(comments);
    }

    // POST: api/defaults/1/comments
    [HttpPost]
    public async Task<ActionResult<CommentDto>> PostComment(int defaultId, CreateCommentDto createDto)
    {
        // Проверяем, существует ли дефолт
        var defaultExists = await _context.Defaults.AnyAsync(d => d.Id == defaultId);
        if (!defaultExists)
        {
            return NotFound($"Default with id {defaultId} not found");
        }

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
            CreatedAt = comment.CreatedAt
        };

        return CreatedAtAction(nameof(GetComments), new { defaultId }, commentDto);
    }
}