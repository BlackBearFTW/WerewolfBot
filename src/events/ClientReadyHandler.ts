import {client} from "../index";
import {status} from "../config.json";
import BaseEventHandler from "../abstracts/BaseEventHandler";

class ClientReadyHandler extends BaseEventHandler {
	constructor() {
		super("ready", false);
	}

	async handle() {
		try {
			console.log(`${client.user?.username} is ready!`);

			if (client.user === null) return;

			client.user.setActivity(status.message, {type: "PLAYING"});
		} catch (error) {
			console.log(error);
		}
	}
}

export default ClientReadyHandler;