using DSharpPlus;
using DSharpPlus.Entities;
using DSharpPlus.EventArgs;

namespace Werewolf.Bot;

public class Worker : BackgroundService
{
    private readonly DiscordClient _client;
    private readonly ILogger<Worker> _logger;

    public Worker(ILogger<Worker> logger, DiscordClient discordClient)
    {
        _logger = logger;
        _client = discordClient;
    }

    public override async Task StartAsync(CancellationToken cancellationToken)
    {
        await _client.ConnectAsync();
        _client.Ready += OnClientReady;
    }

    private async Task OnClientReady(DiscordClient client, ReadyEventArgs e)
    {
        await client.UpdateStatusAsync(new DiscordActivity("with your fears", ActivityType.Playing));
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        await _client.DisconnectAsync();
        _client.Dispose();
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        return Task.CompletedTask;
    }
}