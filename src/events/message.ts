import {Message} from "discord.js";

import {EventInterface} from "../interfaces/EventInterface";
import CommandsHandler from "../handlers/CommandsHandler";

export const event: EventInterface = {
	name: "message",
	once: false,
	disabled: false,
	async execute(message: Message) {
		const commandHandler = CommandsHandler.getInstance();

		commandHandler.registerFiles("!w", "./commands");
		const data = commandHandler.parseCommand(message)!;

		await commandHandler.executeCommand(message, data.command, data.args);
	}
};