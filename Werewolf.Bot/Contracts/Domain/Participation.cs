using Werewolf.Bot.Contracts.Domain.Abstract;
using Werewolf.Bot.Contracts.Types;

namespace Werewolf.Bot.Contracts.Domain;

public class Participation
{
    public Guid Id { get; set; }

    public bool AsLeader { get; set; } = false;
    public bool IsAlive { get; set; } = true;
    
    public Role? Role { get; set; }
    public User User { get; set; }

}