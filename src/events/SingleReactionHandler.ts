import {client} from "../index";
import BaseEventHandler from "../abstracts/BaseEventHandler";
import {MessageReaction, User} from "discord.js";

class SingleReactionHandler extends BaseEventHandler {
	constructor() {
		super("messageReactionAdd", false);
	}

	async handle(reaction: MessageReaction, user: User) {
		try {
			const message = reaction.message;

			if (user.bot || message.author.id !== client.user!.id || !message.embeds) return;

			if (!message.embeds[0].title?.startsWith("Vote: ")) return;

			const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));

			for (const userReaction of userReactions.values()) {
				if (userReaction !== reaction) {
					await userReaction.users.remove(user.id);
				}
			}
		} catch (error) {
			console.log(error);
		}
	}
}

export default SingleReactionHandler;