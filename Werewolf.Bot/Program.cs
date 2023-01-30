using DSharpPlus;
using DSharpPlus.SlashCommands;
using Microsoft.EntityFrameworkCore;
using Werewolf.Bot;
using Werewolf.Bot.Contracts.Types.Interfaces;
using Werewolf.Bot.Extensions;
using Werewolf.Bot.Persistence;

var host = Host.CreateDefaultBuilder(args)
    .ConfigureServices((ctx, services )=>
    {
        services.AddDbContext<DataContext>(options =>
        {
            string connectionString = ctx.Configuration.GetConnectionString("MariaDB");
            MariaDbServerVersion serverVersion = new(ServerVersion.AutoDetect(connectionString));

            options.UseMySql(connectionString, serverVersion,
                mySqlOptions => mySqlOptions.EnableStringComparisonTranslations());
        });

        services.AddSingleton<TestClass>();
        services.AddHostedService<Worker>();
    })
    .Build();

host.Run();