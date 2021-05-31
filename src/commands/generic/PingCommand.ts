import {Message} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import {client} from "../../index";

class PingCommand extends BaseCommand {
	constructor() {
		super(
			"ping",
			"This command shows the ping time"
		);
	}

	async execute(message: Message, args: string[]) {
		await message.channel.send(`Pong! Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
	}
}

export default PingCommand;