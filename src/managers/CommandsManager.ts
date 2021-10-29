import fs from "fs";
import {Collection, ColorResolvable, CommandInteraction, MessageEmbed} from "discord.js";
import BaseCommand from "../abstracts/BaseCommand";
import {commandsFolder, embedColors} from "../config.json";
import Singleton from "../types/decorators/Singleton";
import path from "path";

// TODO: Support Slash Commands

@Singleton
class CommandsManager {
	private commands = new Collection<string, BaseCommand>();

	public async loadCommandFiles() {
		const rootFolder = path.join(__dirname, "../", commandsFolder);

		// Retrieves all folders inside the given folder and then the files inside those folders get imported
		const commandFolderContent = fs.readdirSync(rootFolder, {withFileTypes: true}).filter(folder => folder.isDirectory()).map(folder => folder.name);

		for (const folder of commandFolderContent) {
			const commandFiles = fs.readdirSync(`${rootFolder}/${folder}`).filter((file: string) => file.endsWith(".js") || file.endsWith(".ts"));

			for (const file of commandFiles) {
				const {default: Command} = await import(`${rootFolder}/${folder}/${file}`);

				this.commands.set(new Command().getName().toLowerCase(), new Command());
			}
		}
	}

	public async executeCommand(interaction: CommandInteraction): Promise<void> {
		const commandInstance = await this.commands.get(interaction.commandName.toLowerCase())!;

		const [allowedToExecute, errorMessage] = await this.doPropertyChecks(commandInstance);

		if (allowedToExecute) return commandInstance.execute(interaction);

		const embed = new MessageEmbed();

		embed.setTitle("Error");
		embed.setColor(embedColors.errorColor as ColorResolvable);
		embed.setDescription(errorMessage!);

		await interaction.reply({
			embeds: [embed],
			ephemeral: true
		});
	}

	private async doPropertyChecks(commandInstance: BaseCommand): Promise<[boolean, string | null]> {
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
	}

	public getCommandsJson() {
		return this.commands.map(command => ({
			name: command.getName(),
			description: command.getDescription()
		}));
	}
}

export default CommandsManager;
