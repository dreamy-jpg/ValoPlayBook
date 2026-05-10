using ValoPlayBook.API.Models.DTOs;
using ValoPlayBook.Core.Models;
using System.Linq;

namespace ValoPlayBook.API.Helpers
{
    public static class MappingHelper
    {
        public static DefaultDto MapToDto(Default entity)
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
                ImageUrl = entity.ImageUrl,
                CreatedByUserId = entity.CreatedByUserId,
                CreatedByUserName = entity.CreatedByUser?.Username,
                CreatedByUserAvatar = entity.CreatedByUser?.AvatarUrl,
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
                        ZoneType = sa.Ability?.ZoneType.ToString() ?? "Circle",
                        Radius = sa.Ability?.DefaultRadius,
                        Length = sa.Ability?.DefaultLength,
                        Width = sa.Ability?.DefaultWidth,
                        Angle = sa.Ability?.DefaultAngle,
                        DurationSteps = sa.Ability?.DefaultDurationSteps ?? 1
                    }).ToList()
                }).ToList()
            };
        }
    }
}