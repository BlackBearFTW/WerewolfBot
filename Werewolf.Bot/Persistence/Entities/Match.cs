using Werewolf.Bot.Domain;

namespace Werewolf.Bot.Persistence.Entities;

public class Match
{
    public ulong Id { get; set; }
    public string InviteCode { get; set; }
    public Status Status { get; set; }
}