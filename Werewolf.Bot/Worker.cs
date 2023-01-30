using DSharpPlus;
using DSharpPlus.Entities;
using DSharpPlus.EventArgs;
using DSharpPlus.SlashCommands;
using Werewolf.Bot.Contracts.Types.Interfaces;

namespace Werewolf.Bot;

public class Worker : BackgroundService
{
    private DiscordClient _client;
    
    // Injected
    private readonly IConfiguration _configuration;
    private readonly IServiceProvider _serviceProvider;

    public Worker(IConfiguration configuration, IServiceProvider serviceProvider)
    {
        _configuration = configuration;
        _serviceProvider = serviceProvider;
    }

    public override async Task StartAsync(CancellationToken cancellationToken)
    {
        _client = new DiscordClient(new DiscordConfiguration
        {
            Token = _configuration.GetValue<string>("BotToken"),
            TokenType = TokenType.Bot,
            Intents = DiscordIntents.AllUnprivileged,
        });

        var slash = _client.UseSlashCommands(new SlashCommandsConfiguration
        {
            Services = _serviceProvider
        });

        slash.RegisterCommands(typeof(IAssemblyMarker).Assembly);

        slash.SlashCommandErrored += (sender, eventArgs) =>
        {
            Console.WriteLine(eventArgs.Exception.Message);
            return null;
        };
        
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