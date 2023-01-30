using Werewolf.Bot.Contracts.Types;

namespace Werewolf.Bot.Contracts.Domain.Abstract;

public abstract class Role
{
    public virtual Task OnMatchStart() => Task.CompletedTask;
    public virtual Task OnMatchEnd() => Task.CompletedTask;
    public virtual Task OnDayTime() => Task.CompletedTask;
    public virtual Task OnNightTime() => Task.CompletedTask;
    public virtual Task OnSpecialMove() => Task.CompletedTask;
    
    public virtual Task OnDeath() => Task.CompletedTask;
}