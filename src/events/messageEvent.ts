import {Message} from "discord.js";
import {EventInterface} from "../interfaces/EventInterface";
import CommandsManager from "../managers/CommandsManager";

export const event: EventInterface = {
	event: "message",
	once: false,
	disabled: false,
	async execute(message: Message) {
		try {
			const commandHandler = CommandsManager.getInstance();
			const data = commandHandler.parseMessage(message)!;

			if (!data) return;

			await commandHandler.executeCommand(message, data.command, data.args);
		} catch (error) {
			console.log(error);
		}
	}
};