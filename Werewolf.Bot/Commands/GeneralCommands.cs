using DSharpPlus.SlashCommands;

namespace Werewolf.Bot.Commands;

public class GeneralCommands : ApplicationCommandModule
{
    [SlashCommand("ping", "Get the current latency of the bot in milliseconds")]
    public async Task OnPingCommand(InteractionContext ctx)
    {
        await ctx.CreateResponseAsync(
            $"Pong! Latency is {DateTimeOffset.Now.Millisecond - ctx.Interaction.CreationTimestamp.DateTime.Millisecond}ms",
            true
        );
    }
}