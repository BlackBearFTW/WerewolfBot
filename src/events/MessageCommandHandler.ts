import {Message} from "discord.js";
import CommandsManager from "../managers/CommandsManager";
import BaseEventHandler from "../abstracts/BaseEventHandler";

// TODO: Change / Fix To Support Slash Commands
class MessageCommandHandler extends BaseEventHandler {
	constructor() {
		super("message", false);
	}

	async handle(message: Message) {
		try {
			const commandHandler = new CommandsManager();
			const data = commandHandler.parseMessage(message);

			if (!data) return;

			await commandHandler.executeCommand(message, data.command, data.args);
		} catch (error) {
			console.log(error);
		}
	}
}

export default MessageCommandHandler;