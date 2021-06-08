import {Message, MessageEmbed} from "discord.js";
import {embedColors} from "../config.json";
import {client} from "../index";

class NotificationUtil {
	static async sendErrorEmbed(message: Message, description = "There was an error", title = "Error", selfDestruct = true) {
		const embed = await this.generateEmbed(description, title, embedColors.errorColor);
		const errorMessage = await message.channel.send(embed);

		if (selfDestruct) await errorMessage.delete({ timeout: 7500 });
	}

	static async sendConfirmationEmbed(message: Message, description = "Confirm this action", title = "Confirm") {
		const embed = await this.generateEmbed(description, title, embedColors.warningColor);
		const confirmMessage = await message.channel.send(embed);

		await confirmMessage.react("✅");
		await confirmMessage.react(client.emojis.cache.get("851796794019282946")!);
	}

	private static async generateEmbed(description: string, title: string, color: string) {
		const embed = new MessageEmbed();

		embed.setTitle(title);
		embed.setDescription(description);
		embed.setColor(color);

		return embed;
	}
}

export default NotificationUtil;