import { client } from "../index.js";
export const event = {
    name: 'messageReactionAdd',
    once: false,
    disabled: false,
    async execute(reaction, user) {
        var _a;
        if (user.bot)
            return;
        if (reaction.message.author.id !== ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id))
            return;
        const userReactions = reaction.message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
        for (const userReaction of userReactions.values()) {
            if (userReaction === reaction)
                continue;
            await userReaction.users.remove(user.id);
        }
    }
};
