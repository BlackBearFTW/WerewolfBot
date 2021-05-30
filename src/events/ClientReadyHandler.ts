import {client} from "../index";
import {status} from "../config.json";
import {ActivityType} from "discord.js";
import BaseEventHandler from "../abstracts/BaseEventHandler";

class ClientReadyHandler extends BaseEventHandler {
	constructor() {
		super("ready", false);
	}

	async handle() {
		try {
			console.log(`${client.user?.username} is ready!`);

			if (client.user === null) return;

			await client.user.setActivity(status.message, {
				type: status.type as ActivityType
			});
		} catch (error) {
			console.log(error);
		}
	}
}

export default ClientReadyHandler;