using DSharpPlus;
using Werewolf.Bot.Contracts.Domain;
using Werewolf.Bot.Contracts.Domain.Abstract;
using Werewolf.Bot.Contracts.Entities;
using Werewolf.Bot.Persistence;

namespace Werewolf.Bot.factories;

public class RoleFactory
{
    private readonly DataContext _dataContext;
    private readonly DiscordClient _discordClient;

    public RoleFactory(DataContext dataContext, DiscordClient discordClient)
    {
        _dataContext = dataContext;
        _discordClient = discordClient;
    }

    public T Create<T>(Participation participation) where T : Role
    {
        var constructor = typeof(T)
            .GetConstructor(new Type[] { typeof(Participation), typeof(DataContext), typeof(DiscordClient) });
        
        if (constructor == null) throw new InvalidOperationException(
            $"Type {typeof(T)} does not have a constructor with the desired signature.");
        
        return (T)Activator.CreateInstance(typeof(T), participation, _dataContext, _discordClient )!;
    }
}