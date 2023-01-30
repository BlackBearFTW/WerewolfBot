using Werewolf.Bot.Contracts.Types;

namespace Werewolf.Bot.Contracts.Entities;

public class MatchEntity
{
    public ulong Id { get; set; }
    public string InviteCode { get; set; }
    public Status Status { get; set; }
}