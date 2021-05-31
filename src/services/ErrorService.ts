import Singleton from "../decorators/Singleton";
import {Message} from "discord.js";

@Singleton
class ErrorService {
	async throwError(message: Message, errorMessage = "There was an error") {
		const error = await message.reply(errorMessage);

		await error.delete({ timeout: 7500 });
	}
}

export default ErrorService;