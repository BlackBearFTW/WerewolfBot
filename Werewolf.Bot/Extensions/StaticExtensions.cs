using DSharpPlus;

namespace Werewolf.Bot.Extensions;

public static class StaticExtensions
{
    public static AsyncListenerExtension UseAsyncListeners(this DiscordClient client, IServiceProvider services)
    {
        var extension = new AsyncListenerExtension(services);
        client.AddExtension(extension);
        return extension;
    }
}