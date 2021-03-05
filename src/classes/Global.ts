import {Message} from "discord.js";

class Global {

	static async throwError(message: Message, errorMessage = 'There was an error') {
		const error = await message.reply(errorMessage);
		await error.delete({ timeout: 7500 });
	}
}

export default Global