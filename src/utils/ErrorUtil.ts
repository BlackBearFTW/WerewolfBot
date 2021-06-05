import {Message, MessageEmbed} from "discord.js";
import {embedColors} from "../config.json";

class ErrorUtil {
	static async throwError(message: Message, errorMessage = "There was an error", errorTitle = "Error", selfDestruct = true) {
		const embed = new MessageEmbed();

		embed.setTitle(errorTitle);
		embed.setDescription(errorMessage);
		embed.setColor(embedColors.errorColor);

		const error = await message.channel.send(embed);

		if (selfDestruct) await error.delete({ timeout: 7500 });
	}
}

export default ErrorUtil;