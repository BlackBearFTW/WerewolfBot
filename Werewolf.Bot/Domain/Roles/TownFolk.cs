using DSharpPlus;
using Werewolf.Bot.Items;
using Werewolf.Bot.Persistence;
using Werewolf.Bot.Persistence.Entities;

namespace Werewolf.Bot.Domain.Roles;

public class TownFolk : Role
{
    private readonly Participation _participant;
    private readonly DataContext _context;
    private readonly DiscordClient _client;
    
    
    public TownFolk(Participation participant, DataContext context, DiscordClient client) : base(RoleType.TownFolk)
    {
        _participant = participant;
        _context = context;
        _client = client;
    }
    
    public override Task OnDeath()
    {
        // Get Participant
        
        // Set isAlive to false
        
        // Discord -> Mute, Disable talking
        
        
        return Task.CompletedTask;
    }
}