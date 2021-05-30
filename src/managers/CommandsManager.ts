import fs from "fs";
import {Collection, Message} from "discord.js";
import BaseCommand from "../abstracts/BaseCommand";
import {commandsFolder, prefix} from "../config.json";

class CommandsManager {
	private static instance: CommandsManager;
	private commands = new Collection<string, BaseCommand>();

	// eslint-disable-next-line
	private constructor() {
	}

	static getInstance(): CommandsManager {
		if (!CommandsManager.instance) {
			CommandsManager.instance = new CommandsManager();
		}

		return CommandsManager.instance;
	}

	async executeCommand(message: Message, command: string, args: string[]) {
		if (this.commands.size === 0) await this.loadCommandFiles();

		if (!this.commands.has(command)) return;

		await this.commands.get(command)?.execute(message, args);
		message?.delete();
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
		// Retrieves all folders inside the given folder and then the files inside those folders get imported
		const commandFolderContent = fs.readdirSync(`./${commandsFolder}`, {withFileTypes: true}).filter(folder => folder.isDirectory()).map(folder => folder.name);

		for (const folder of commandFolderContent) {
			const commandFiles = fs.readdirSync(`./${commandsFolder}/${folder}`).filter((file: string) => file.endsWith(".js"));

			for (const file of commandFiles) {
				const {default: Command} = await import(`../${commandsFolder}/${folder}/${file}`);

				this.commands.set(new Command().getName().toLowerCase(), new Command());
			}
		}
	}
}

export default CommandsManager;