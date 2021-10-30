import {status} from "../config.json";
import BaseEventHandler from "../abstracts/BaseEventHandler";
import DiscordUtil from "../utils/DiscordUtil";
import CommandsManager from "../managers/CommandsManager";

class ClientReadyHandler extends BaseEventHandler {
	constructor() {
		super("ready", false);
	}

	async handle() {
		try {
			const client = DiscordUtil.getClient();
			const commandsHandler = new CommandsManager();

			client.user!.setActivity(status.message, {type: "PLAYING"});

			await commandsHandler.loadCommandFiles();

			await client.application!.commands.set(commandsHandler.getCommandsJson(), "772538571386519562");

			console.log(`${client.user!.username} is ready!`);
		} catch (error) {
			console.log(error);
		}
	}
}

export default ClientReadyHandler;