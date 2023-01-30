using Werewolf.Bot.Contracts.Types;

namespace Werewolf.Bot.Contracts.Domain;

public class Match
{
    public ulong Id { get; set; }
    public string InviteCode { get; set; }
    public Status Status { get; set; }
    public List<Participation> Participations { get; set; }
    
}