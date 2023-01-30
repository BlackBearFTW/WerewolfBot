namespace Werewolf.Bot.Contracts.Entities;

public class UserEntity
{
    public ulong Id { get; set; }
    public int WinCount { get; set; }
    public int LoseCount { get; set; }
    public int DeathCount { get; set; }
    public int PlayedAsWerewolf { get; set; }
}