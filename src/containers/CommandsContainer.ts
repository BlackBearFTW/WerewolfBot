import {
	ApplicationCommandData,
	CommandInteraction, MessageEmbed
} from "discord.js";
import {commandsFolder} from "../config.json";
import Singleton from "../types/decorators/Singleton";
import path from "path";
import glob from "glob";
import ApplicationCommandStorage from "../types/ApplicationCommandStorage";

// TODO: Support Slash Commands

@Singleton
class CommandsContainer {
	public async runSetup() {
		glob
			.sync(`${path.join(__dirname, "../")}${commandsFolder}/**/*.+(js|ts)`)
			.map(i => import(i));
	}

	public async handleCommandInteraction(interaction: CommandInteraction): Promise<void> {
		if (!interaction.guild) {
			return interaction.reply({embeds: [new MessageEmbed({
				title: "Can't use commands here....",
				description: "Commands can only be used in servers",
				color: "RED"
			})]});
		}

		const data = await ApplicationCommandStorage
			.getInstance().find((v, k) => v.name === interaction.commandName.toLowerCase());

		const commandInstance = new data.target();

		commandInstance.onInteraction(interaction);

		/*		Const [allowedToExecute, errorMessage] = await this.doPropertyChecks(commandInstance);

		if (allowedToExecute) return commandInstance.onInteraction(interaction);

		const embed = new MessageEmbed();

		embed.setTitle("Error");
		embed.setColor(embedColors.errorColor as ColorResolvable);
		embed.setDescription(errorMessage!);

		await interaction.reply({
			embeds: [embed],
			ephemeral: true
		});*/
	}

	/* Private async doPropertyChecks(commandInstance: BaseCommand): Promise<[boolean, string | null]> {
		let allowedToExecute = true;
		let errorMessage: string | null = null;

		if (commandInstance.getProperty("onlyInLobby")) {
			// If (await lobbyRepository.findByCategory(category) === null) {
			// 	// await NotificationUtil.sendErrorEmbed(message, "This channel doesn't belong to a lobby.");
			// TODO: Check if category exits

			errorMessage = "This channel doesn't belong to a lobby.";
			allowedToExecute = false;
		}

		if (commandInstance.getProperty("onlyLeader")) {
			// If (!await participationService.isLeader(message.author, category)) {
			// 	Await NotificationUtil.sendErrorEmbed(message, "Only the lobby leader can use this command.");
			// 	AllowedToExecute = false;
			// }

			errorMessage = "Only the lobby leader can use this command.";
			allowedToExecute = false;
		}

		if (commandInstance.getProperty("disableWhenStarted")) {
			// Const lobbyData = await lobbyRepository.findByCategory(category);
			//
			// If (lobbyData === null || lobbyData?.started === true) {
			// 	Await NotificationUtil.sendErrorEmbed(message, "Can't use this command, the game has already started.");
			// 	AllowedToExecute = false;
			// }

			errorMessage = "Can't use this command, the game has already started.";
			allowedToExecute = false;
		}

		return [allowedToExecute, errorMessage];
	}*/

  	public getCommandsJson(): ApplicationCommandData[] {
		return ApplicationCommandStorage.getInstance().map(v => v);
	}
}

export default CommandsContainer;
