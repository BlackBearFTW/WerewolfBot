/*
Import {client} from "../index";
import BaseEventHandler from "../abstracts/BaseEventHandler";
import {MessageReaction, User} from "discord.js";

// TODO: Use Select Menu's instead
class VoteReactionHandler extends BaseEventHandler {
    constructor() {
        super("messageReactionAdd", false);
    }

    async handle(reaction: MessageReaction, user: User) {
        try {
            const message = reaction.message;
            const numberEmotes = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹", "🇺", "🇻", "🇼", "🇽", "🇾", "🇿"];

            if (user.bot || message.author.id !== client.user?.id || !message.embeds) return;

            if (!message.embeds[0].title?.startsWith("Vote: ")) return;

            const embedDescription = message.embeds[0].description;
            const emotesInDescription = numberEmotes.filter(emote => embedDescription?.includes(emote));

            if (!emotesInDescription.includes(reaction.emoji.toString())) {
                await reaction.remove();
                return;
            }

            message.reactions.cache
                .filter(singleReaction => singleReaction.emoji.name !== reaction.emoji.name)
                .map(oldReaction => oldReaction.users.remove(user.id));
        } catch (error) {
            console.log(error);
        }
    }
}

export default VoteReactionHandler;*/
