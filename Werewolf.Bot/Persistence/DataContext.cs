using Microsoft.EntityFrameworkCore;
using Werewolf.Bot.Contracts.Entities;

namespace Werewolf.Bot.Persistence;

public class DataContext : DbContext
{
    public DbSet<UserEntity> Users { get; set; }
    public DbSet<ParticipationEntity> Participations { get; set; }
    public DbSet<MatchEntity> Matches { get; set; }
    
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }
}