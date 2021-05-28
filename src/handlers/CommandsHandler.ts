import fs from "fs";
import {Collection, Message} from "discord.js";
import {CommandInterface} from "../interfaces/CommandInterface";

class CommandsHandler {
	private static instance: CommandsHandler;
	private commands = new Collection<string, CommandInterface>();
	private prefix: string = "";

	// eslint-disable-next-line
	private constructor() {
	}

	public static getInstance(): CommandsHandler {
		if (!CommandsHandler.instance) {
			CommandsHandler.instance = new CommandsHandler();
		}

		return CommandsHandler.instance;
	}

	public registerFiles(prefix: string, filePath: string) {
		this.prefix = prefix;

		// Retrieves all folders inside the given folder and then the files inside those folders get imported
		const commandFolders = fs.readdirSync(filePath, {withFileTypes: true}).filter(folder => folder.isDirectory()).map(folder => folder.name);

		for (const folder of commandFolders) {
			const commandFiles = fs.readdirSync(`${filePath}/${folder}`).filter((file: string) => file.endsWith(".js"));

			for (const file of commandFiles) {
				(async () => {
					const {command} = await import(`.${filePath}/${folder}/${file}`);

					this.commands.set(command.name, command);
				})();
			}
		}
	}

	public async executeCommand(message: Message, command: string, args: string[]) {
		if (!this.commands.has(command)) return;

		this.commands.get(command)?.execute(message, args);
		message?.delete();
	}

	public parseCommand(message: Message) {
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
}

export default CommandsHandler;