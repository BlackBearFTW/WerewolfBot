using DSharpPlus;
using DSharpPlus.Entities;
using DSharpPlus.SlashCommands;
using Werewolf.Bot.Contracts.Entities;
using Werewolf.Bot.Contracts.Types;
using Werewolf.Bot.Persistence;
using Werewolf.Bot.Utilities;

namespace Werewolf.Bot.Commands;

[SlashCommandGroup("lobby", "A collection of commands related to lobby management")]
public class LobbyCommands : ApplicationCommandModule
{
    private readonly TestClass _testClass;
    private readonly DataContext _context;
    
    public LobbyCommands(TestClass testClass, DataContext context)
    {
        _testClass = testClass;
        _context = context;
        //_logger = logger;
    }

    [SlashCommand("create", "Create a new lobby")]
    public async Task OnCreateCommand(InteractionContext ctx)
    {
        var inviteCode = TokenGeneratorUtility.Generate(6);
        
        DiscordChannel category = await ctx.Guild.CreateChannelCategoryAsync($"Werewolf Lobby: {inviteCode}", new []
        {
            new DiscordOverwriteBuilder(ctx.Member)
                .Allow(Permissions.AccessChannels).Allow(Permissions.SendMessages),
            new DiscordOverwriteBuilder(ctx.Guild.EveryoneRole)
                .Deny(Permissions.AccessChannels).Deny(Permissions.SendMessages)
        });

        await ctx.Guild.CreateTextChannelAsync("main", category);
        await ctx.Guild.CreateVoiceChannelAsync("voice", category, overwrites: new []
        {
            new DiscordOverwriteBuilder(ctx.Guild.EveryoneRole)
                .Deny(Permissions.AccessChannels).Deny(Permissions.SendMessages)
        });

        _context.Matches.Add(new MatchEntity()
        {
            Id = category.Id,
            InviteCode = inviteCode,
            Status = Status.InLobby
        });
        
        await _context.SaveChangesAsync();
        
        //_logger.LogInformation($"Created new lobby, invite code: {inviteCode}");
        _testClass.Run();
        
        await ctx.CreateResponseAsync(
            $"Successfully created lobby `{inviteCode}`",
            true
        );
    }

    [SlashCommand("delete", "Delete a lobby")]
    public async Task OnDeleteCommand(InteractionContext ctx)
    {
        // Check if this is a lobby, don't delete random categories lol
        var category = ctx.Channel.Parent;

        foreach (var channel in category.Children)
        {
            await channel.DeleteAsync();
        }

        await category.DeleteAsync();
        
        await ctx.CreateResponseAsync(
            "Not implemented yet",
            true
        );
    }

    [SlashCommand("join", "Join a given lobby")]
    public async Task OnJoinCommand(InteractionContext ctx, [Option("code", "The code of the lobby")] string code)
    {
        await ctx.CreateResponseAsync(
            "Not implemented yet",
            true
        );
    }

    [SlashCommand("leave", "Leave a given lobby")]
    public async Task OnLeaveCommand(
        InteractionContext ctx,
        [Option("code", "The code of the lobby")]
        string? code = null
    )
    {
        await ctx.CreateResponseAsync(
            "Not implemented yet",
            true
        );
    }
}