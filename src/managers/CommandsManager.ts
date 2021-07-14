import fs from "fs";
import {CategoryChannel, Collection, Message, TextChannel} from "discord.js";
import BaseCommand from "../abstracts/BaseCommand";
import {commandsFolder, prefix} from "../config.json";
import Singleton from "../decorators/Singleton";
import LobbyRepository from "../repositories/LobbyRepository";
import NotificationUtil from "../utils/NotificationUtil";
import ParticipationService from "../services/ParticipationService";
import path from "path";

@Singleton
class CommandsManager {
	private commands = new Collection<string, BaseCommand>();

	async executeCommand(message: Message, command: string, args: string[]) {
		if (this.commands.size === 0) await this.loadCommandFiles();

		if (!this.commands.has(command.toLowerCase())) return;

		const commandInstance = await this.commands.get(command.toLowerCase())!;

		if (!await this.doPropertyChecks(commandInstance, message)) return;

		commandInstance?.execute(message, args);

		if (commandInstance!.getProperty("selfDestruct")) message?.delete();
	}

	parseMessage(message: Message) {
		if (!message.content.startsWith(prefix) || message.author.bot || !message.guild) return;

		const content: string = message.content.substring(prefix.length);
		let args = content.match(/[^\s"]+|"([^"]*)"/gi);

		if (args === null) return;

		args = args.map(content => content.replace(/^"(.+(?="$))"$/, "$1"));

		return {
			"command": args.shift()!,
			"args": args
		};
	}

	private async loadCommandFiles() {
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

	private async doPropertyChecks(commandInstance: BaseCommand, message: Message): Promise<boolean> {
		let allowedToExecute = true;
		const lobbyRepository = new LobbyRepository();
		const participationService = new ParticipationService();
		const channel = message.channel as TextChannel;
		const category = channel.parent as CategoryChannel;

		if (commandInstance.getProperty("onlyInLobby")) {
			if (await lobbyRepository.findByCategory(category) === null) {
				await NotificationUtil.sendErrorEmbed(message, "This channel doesn't belong to a lobby.");
				allowedToExecute = false;
			}
		}

		if (commandInstance.getProperty("onlyLeader")) {
			if (!await participationService.isLeader(message.author, category)) {
				await NotificationUtil.sendErrorEmbed(message, "Only the lobby leader can use this command.");
				allowedToExecute = false;
			}
		}

		if (commandInstance.getProperty("disableWhenStarted")) {
			const lobbyData = await lobbyRepository.findByCategory(category);

			if (lobbyData === null || lobbyData?.started === true) {
				await NotificationUtil.sendErrorEmbed(message, "Can't use this command, the game has already started.");
				allowedToExecute = false;
			}
		}

		if (commandInstance!.getProperty("selfDestruct")) message?.delete();
		return allowedToExecute;
	}
}

export default CommandsManager;
