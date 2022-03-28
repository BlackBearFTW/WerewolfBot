import {status} from "../config.json";
import BaseEventHandler from "../abstracts/BaseEventHandler";
import DiscordUtil from "../utils/DiscordUtil";
import CommandsContainer from "../containers/CommandsContainer";

class ClientReadyHandler extends BaseEventHandler {
	constructor() {
		super("ready", false);
	}

	async handle() {
		try {
			const client = DiscordUtil.getClient();
			const commandsContainer = new CommandsContainer();

			client.user!.setActivity(status.message, {type: "PLAYING"});

			await commandsContainer.runSetup();

			await client.application!.commands.set(commandsContainer.getCommandsJson(), "772538571386519562");

			console.log(`${client.user!.username} is ready!`);
		} catch (error) {
			console.log(error);
		}
	}
}

export default ClientReadyHandler;