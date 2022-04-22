import {CommandInteraction} from "discord.js";
import SlashCommand from "../../types/decorators/SlashCommand";
import ICommand from "../../types/interfaces/CommandInterface";

@SlashCommand("ping", "Get the current bot latency")
class PingCommand implements ICommand {
	async onInteraction(interaction: CommandInteraction) {
		await interaction.reply({
			content: `Pong! Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(interaction.client.ws.ping)}ms`,
			ephemeral: true
		});
	}
}

export default PingCommand;