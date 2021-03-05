import {Message, MessageReaction, User} from "discord.js";
import {client} from "../index.js";
import {EventInterface} from "../interfaces/EventInterface";

export const event: EventInterface = {
    name: 'messageReactionAdd',
    once: false,
    disabled: false,
    async execute(reaction: MessageReaction, user: User) {

        if (user.bot) return;

        if (reaction.message.author.id !== client.user?.id) return;

        const userReactions = reaction.message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));

        for (const userReaction of userReactions.values()) {
            if (userReaction === reaction) continue;
            await userReaction.users.remove(user.id);
        }
    }
};