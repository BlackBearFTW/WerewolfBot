import {Message} from "discord.js";
import CommandsManager from "../managers/CommandsManager";
import BaseEventHandler from "../abstracts/BaseEventHandler";

class MessageCommandHandler extends BaseEventHandler {
	constructor() {
		super("message", false);
	}

	async handle(message: Message) {
		try {
			const commandHandler = CommandsManager.getInstance();
			const data = commandHandler.parseMessage(message);

			if (!data) return;

			await commandHandler.executeCommand(message, data.command, data.args);
		} catch (error) {
			console.log(error);
		}
	}
}

export default MessageCommandHandler;