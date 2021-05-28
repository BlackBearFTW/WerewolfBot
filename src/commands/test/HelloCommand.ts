import {Message} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";

class HelloCommand extends BaseCommand {
	constructor() {
		super(
			"hello",
			"This command greets the user"
		);
	}

	async execute(message: Message, args: string[]) {
		await message.channel.send(`Hello <@${message.author.id}>!`);
	}
}

export default HelloCommand;