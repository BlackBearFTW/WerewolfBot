import BaseCommand from "../../abstracts/BaseCommand";
import {CommandInteraction} from "discord.js";

class PingCommand extends BaseCommand {
	constructor() {
		super({
			name: "ping",
			description: "Shows latency"
		});
	}

	async execute(interaction: CommandInteraction) {
		await interaction.reply({
			content: `Pong! Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(interaction.client.ws.ping)}ms`,
			ephemeral: true
		});
	}
}

export default PingCommand;