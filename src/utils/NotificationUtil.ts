import {Message, MessageEmbed, MessageReaction, User} from "discord.js";
import {embedColors} from "../config.json";
import {client} from "../index";

class NotificationUtil {
	static async sendErrorEmbed(message: Message, description = "There was an error", title = "Error", selfDestruct = true) {
		const embed = await this.generateEmbed(description, title, embedColors.errorColor);
		const errorMessage = await message.channel.send(embed);

		if (selfDestruct) await errorMessage.delete({ timeout: 7500 });
	}

	static async sendConfirmationEmbed(message: Message, user: User, description = "Confirm this action", title = "Confirm") {
		const embed = await this.generateEmbed(description, title, embedColors.warningColor, true);
		const confirmMessage = await message.channel.send(embed);

		await confirmMessage.react("✅");
		await confirmMessage.react(client.emojis.cache.get("851796794019282946")!);

		// eslint-disable-next-line func-style
		const filter = (reaction: MessageReaction, _user: User) => ["square_cross", "✅"].includes(reaction.emoji.name!) && _user.id === user.id;

		const reactions = await confirmMessage.awaitReactions(filter, {max: 1, time: 20000});

		if (reactions.size === 0) return false;

		if (reactions.first()!.emoji.name === "✅") {
			return true;
		} else {
			await confirmMessage.delete();
			return false;
		}
	}

	static async sendPollEmbed(message: Message, options: string[], title = "Poll", description = "") {
		if (options.length > 20) throw new Error("You can't have more then 20 options");
		const numberEmotes = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹", "🇺", "🇻", "🇼", "🇽", "🇾", "🇿"];
		let descriptionWithOptions = description;

		if (description !== "") descriptionWithOptions += "\n\n";

		for (const [index, value] of options.entries()) {
			descriptionWithOptions += `${numberEmotes[index]} ${value}\n`;
		}

		const embed = await this.generateEmbed(descriptionWithOptions, `Vote: ${title}`, embedColors.neutralColor, true);
		const pollMessage = await message.channel.send(embed);

		for (const index of options.keys()) {
			await pollMessage.react(numberEmotes[index]);
		}
	}

	private static async generateEmbed(description: string, title: string, color: string, addCurrentTime = false) {
		const embed = new MessageEmbed();

		embed.setTitle(title);
		embed.setDescription(description);
		embed.setColor(color);

		if (addCurrentTime) embed.setTimestamp();

		return embed;
	}
}

export default NotificationUtil;