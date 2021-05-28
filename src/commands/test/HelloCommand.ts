import {Message} from "discord.js";
import {CommandInterface} from "../../interfaces/CommandInterface";

export const command: CommandInterface = {
	name: "hello",
	async execute(message: Message, args: string[]) {
		await message.channel.send(`Hello <@${message.author.id}>!`);
	}
};