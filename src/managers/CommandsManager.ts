import fs from "fs";
import {Collection, Message} from "discord.js";
import BaseCommand from "../abstracts/BaseCommand";

class CommandsManager {
	private static instance: CommandsManager;
	private commands = new Collection<string, BaseCommand>();
	private prefix: string = "";

	// eslint-disable-next-line
	private constructor() {
	}

	public static getInstance(): CommandsManager {
		if (!CommandsManager.instance) {
			CommandsManager.instance = new CommandsManager();
		}

		return CommandsManager.instance;
	}

	public loadCommandFiles(prefix: string, filePath: string) {
		if (this.prefix && this.commands.size > 0) return;
		this.prefix = prefix;

		// Retrieves all folders inside the given folder and then the files inside those folders get imported
		const commandFolders = fs.readdirSync(filePath, {withFileTypes: true}).filter(folder => folder.isDirectory()).map(folder => folder.name);

		for (const folder of commandFolders) {
			const commandFiles = fs.readdirSync(`${filePath}/${folder}`).filter((file: string) => file.endsWith(".js"));

			for (const file of commandFiles) {
				(async () => {
					const {Command} = await import(`.${filePath}/${folder}/${file}`);

					this.commands.set(new Command().getName().toLowerCase(), new Command());
				})();
			}
		}
	}

	public executeCommand(message: Message, command: string, args: string[]) {
		if (!this.commands.has(command)) return;

		this.commands.get(command)?.execute(message, args);
		message?.delete();
	}

	public parseMessage(message: Message) {
		if (!message.content.startsWith(this.prefix) || message.author.bot || message.channel.type !== "text") return;

		const mContent: string = message.content;
		let args = mContent.match(/[^\s"]+|"([^"]*)"/gi);

		if (args === null) return;

		args = args.map(mContent => mContent.replace(/^"(.+(?="$))"$/, "$1"));

		args.shift();

		return {
			"command": args.shift()!,
			"args": args
		};
	}

	public commandExists(command: string) {
		if (command === undefined) return false;
		return this.commands.has(command);
	}
}

export default CommandsManager;