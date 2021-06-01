import Singleton from "../decorators/Singleton";
import {Message, MessageEmbed} from "discord.js";
import {embedColors} from "../config.json";

@Singleton
class ErrorService {
	async throwError(message: Message, errorMessage = "There was an error", errorTitle = "Error") {
		const embed = new MessageEmbed();

		embed.setTitle(errorTitle);
		embed.setDescription(errorMessage);
		embed.setColor(embedColors.errorColor);

		const error = await message.channel.send(embed);

		await error.delete({ timeout: 7500 });
	}
}

export default ErrorService;