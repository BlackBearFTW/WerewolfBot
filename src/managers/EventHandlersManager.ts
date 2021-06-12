import fs from "fs";
import {client} from "../index";

class EventHandlersManager {
	private readonly filePath: string

	constructor(filePath: string) {
		this.filePath = filePath;
		this.loadEventFiles();
	}

	private async loadEventFiles() {
		const eventFiles = fs.readdirSync(this.filePath).filter((file: string) => file.endsWith(".js") || file.endsWith(".ts"));

		for (const file of eventFiles) {
			const {default: EventHandler} = await import(`${this.filePath}/${file}`);

			const eventHandler = new EventHandler();

			if (eventHandler.isDisabled()) return;
			client[eventHandler.onlyOnce() ? "once" : "on"](eventHandler.event, (...args) => eventHandler.handle(...args));
		}
	}
}

export default EventHandlersManager;
