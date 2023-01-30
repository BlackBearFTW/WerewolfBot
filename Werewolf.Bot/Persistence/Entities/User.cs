namespace Werewolf.Bot.Persistence.Entities;

public class User
{
    public ulong Id { get; set; }
    public int WinCount { get; set; }
    public int LoseCount { get; set; }
    public int DeathCount { get; set; }
    public int PlayedAsWerewolf { get; set; }
}