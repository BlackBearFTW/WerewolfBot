using DSharpPlus;
using DSharpPlus.SlashCommands;
using Werewolf.Bot;
using Werewolf.Bot.Extensions;
using Werewolf.Bot.Items.Interfaces;

var host = Host.CreateDefaultBuilder(args)
    .ConfigureServices((ctx, services )=>
    {
        services.AddSingleton<DiscordClient>(serviceProvider =>
        {
            var client = new DiscordClient(new DiscordConfiguration
            {
                Token = ctx.Configuration.GetValue<string>("BotToken"),
                TokenType = TokenType.Bot,
                Intents = DiscordIntents.AllUnprivileged,
            });


            var slash = client.UseSlashCommands(new SlashCommandsConfiguration
            {
                Services = serviceProvider
            });

            slash.RegisterCommands(typeof(IAssemblyMarker).Assembly);

            var listener = client.UseAsyncListeners(serviceProvider);
            listener.RegisterListeners(typeof(IAssemblyMarker).Assembly);

            return client;
        });

        services.AddHostedService<Worker>();
    })
    .Build();

host.Run();