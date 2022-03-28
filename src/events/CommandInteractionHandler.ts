import BaseEventHandler from "../abstracts/BaseEventHandler";
import {Interaction} from "discord.js";
import CommandsContainer from "../containers/CommandsContainer";

class CommandInteractionHandler extends BaseEventHandler {
	constructor() {
		super("interactionCreate", false);
	}

	async handle(interaction: Interaction) {
		try {
			if (!interaction.isCommand()) return;
			const commandsManager = new CommandsContainer();

			await commandsManager.handleCommandInteraction(interaction);
		} catch (error) {
			console.log(error);
		}
	}
}

export default CommandInteractionHandler;