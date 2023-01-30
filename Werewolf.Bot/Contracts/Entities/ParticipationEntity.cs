using Werewolf.Bot.Contracts.Types;

namespace Werewolf.Bot.Contracts.Entities;

public class ParticipationEntity
{
    public Guid Id { get; set; }

    public bool AsLeader { get; set; } = false;
    public bool IsAlive { get; set; } = true;
    
    public RoleType? Role { get; set; }

    // Navigation Properties
    
    public MatchEntity Match { get; set; }
    public ulong MatchId { get; set; }
    
    public UserEntity User { get; set; }
    public ulong UserId { get; set; }
    
}