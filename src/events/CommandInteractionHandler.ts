import BaseEventHandler from "../abstracts/BaseEventHandler";
import {Interaction} from "discord.js";
import CommandsManager from "../managers/CommandsManager";

class CommandInteractionHandler extends BaseEventHandler {
	constructor() {
		super("interactionCreate", false);
	}

	async handle(interaction: Interaction) {
		try {
			if (!interaction.isCommand()) return;
			const commandsManager = new CommandsManager();

			await commandsManager.executeCommand(interaction);
		} catch (error) {
			console.log(error);
		}
	}
}

export default CommandInteractionHandler;