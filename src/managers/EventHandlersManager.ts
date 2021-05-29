import fs from "fs";
import {client} from "../index";

class EventHandlersManager {
	private readonly filePath: string

	constructor(filePath: string) {
		this.filePath = filePath;
		this.loadFiles();
	}

	private loadFiles() {
		const eventFiles = fs.readdirSync(this.filePath).filter((file: string) => file.endsWith(".js"));

		for (const file of eventFiles) {
			(async () => {
				const {event} = await import(`../${this.filePath}/${file}`);

				if (event.disabled) return;
				client[event.once ? "once" : "on"](event.event, (...args) => event.execute(...args));
			})();
		}
	}
}

export default EventHandlersManager;