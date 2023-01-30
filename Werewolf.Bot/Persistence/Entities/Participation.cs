using Werewolf.Bot.Domain;
using Werewolf.Bot.Items;

namespace Werewolf.Bot.Persistence.Entities;

public class Participation
{
    public Guid Id { get; set; }

    public bool AsLeader { get; set; } = false;
    public bool IsAlive { get; set; } = true;
    
    public RoleType? Role { get; set; }

    // Navigation Properties
    
    public Match Match { get; set; }
    public ulong MatchId { get; set; }
    
    public User User { get; set; }
    public ulong UserId { get; set; }
    
}