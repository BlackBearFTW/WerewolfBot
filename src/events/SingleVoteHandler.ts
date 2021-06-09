import {client} from "../index";
import BaseEventHandler from "../abstracts/BaseEventHandler";
import {MessageReaction, User} from "discord.js";

class SingleVoteHandler extends BaseEventHandler {
	constructor() {
		super("messageReactionAdd", false);
	}

	async handle(reaction: MessageReaction, user: User) {
		try {
			const message = reaction.message;
			const numberEmotes = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹", "🇺", "🇻", "🇼", "🇽", "🇾", "🇿"];

			if (user.bot || message.author.id !== client.user!.id || !message.embeds) return;

			if (!message.embeds[0].title?.startsWith("Vote: ")) return;

			const allowedEmotes = numberEmotes.filter(emote => message.embeds[0].description?.includes(emote));

			if (!allowedEmotes.includes(reaction.emoji.toString())) {
				await reaction.remove();
				return;
			}

			const allReactionsByUser = message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));

			for (const userReaction of allReactionsByUser.values()) {
				if (userReaction !== reaction) {
					await userReaction.users.remove(user.id);
				}
			}
		} catch (error) {
			console.log(error);
		}
	}
}

export default SingleVoteHandler;