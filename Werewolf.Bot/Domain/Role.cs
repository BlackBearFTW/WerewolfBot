using DSharpPlus;
using Werewolf.Bot.Items;

namespace Werewolf.Bot.Domain;

public abstract class Role
{
    public RoleType RoleType { get; protected set; }

    protected Role(RoleType roleType)
    {
        RoleType = roleType;
    }
    
    public virtual Task OnMatchStart() => Task.CompletedTask;
    public virtual Task OnMatchEnd() => Task.CompletedTask;
    public virtual Task OnDayTime() => Task.CompletedTask;
    public virtual Task OnNightTime() => Task.CompletedTask;
    public virtual Task OnSpecialMove() => Task.CompletedTask;
    
    public virtual Task OnDeath() => Task.CompletedTask;
}