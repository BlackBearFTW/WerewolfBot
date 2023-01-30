using System.Reflection;
using DSharpPlus;

namespace Werewolf.Bot.Extensions;

public class AsyncListenerExtension : BaseExtension
{
    private DiscordClient client;
    private readonly IServiceProvider services;

    public AsyncListenerExtension(IServiceProvider services)
    {
        this.services = services;
    }

    protected override void Setup(DiscordClient client)
    {
        this.client = client;
    }

    public void RegisterListeners(Assembly assembly)
    {
        var methods = assembly.DefinedTypes
            .SelectMany(x => x.GetMethods())
            .Where(x => x.GetCustomAttribute<AsyncListenerAttribute>() != null)
            .Select(x => new ListenerMethod { Attribute = x.GetCustomAttribute<AsyncListenerAttribute>(), Method = x });

        foreach (var listener in methods) listener.Attribute.Register(client, listener.Method, services);
    }
}

internal class ListenerMethod
{
    public MethodInfo Method { get; internal set; }
    public AsyncListenerAttribute Attribute { get; internal set; }
}