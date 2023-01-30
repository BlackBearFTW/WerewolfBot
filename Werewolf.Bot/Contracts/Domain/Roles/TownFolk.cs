using DSharpPlus;
using Werewolf.Bot.Contracts.Domain.Abstract;
using Werewolf.Bot.Contracts.Entities;
using Werewolf.Bot.Contracts.Types;
using Werewolf.Bot.Persistence;

namespace Werewolf.Bot.Contracts.Domain.Roles;

public class TownFolk : Role
{
    private readonly Participation _participant;
    private readonly DataContext _context;
    private readonly DiscordClient _client;
    
    
    public TownFolk(Participation participant, DataContext context, DiscordClient client)
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