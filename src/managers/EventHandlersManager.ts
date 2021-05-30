import fs from "fs";
import {client} from "../index";

class EventHandlersManager {
	private readonly filePath: string

	constructor(filePath: string) {
		this.filePath = filePath;
		this.loadEventFiles();
	}

	private async loadEventFiles() {
		const eventFiles = fs.readdirSync(this.filePath).filter((file: string) => file.endsWith(".js"));

		for (const file of eventFiles) {
			const {default: Event} = await import(`../${this.filePath}/${file}`);

			const event = new Event();

			if (event.isDisabled()) return;
			client[event.onlyOnce() ? "once" : "on"](event.event, (...args) => event.execute(...args));
		}
	}
}

export default EventHandlersManager;