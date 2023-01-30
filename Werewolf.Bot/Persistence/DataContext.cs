using Microsoft.EntityFrameworkCore;
using Werewolf.Bot.Persistence.Entities;

namespace Werewolf.Bot.Persistence;

public class DataContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Participation> Participations { get; set; }
    public DbSet<Match> Matches { get; set; }
}