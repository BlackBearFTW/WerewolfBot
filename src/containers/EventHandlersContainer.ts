import fs from "fs";
import {eventHandlersFolder} from "../config.json";
import Singleton from "../types/decorators/Singleton";
import path from "path";
import DiscordUtil from "../utils/DiscordUtil";

@Singleton
class EventHandlersContainer {
	public async runSetup() {
		const client = DiscordUtil.getClient();
		const rootFolder = path.join(__dirname, "../", eventHandlersFolder);

		const eventFiles = fs.readdirSync(rootFolder).filter((file: string) => file.endsWith(".js") || file.endsWith(".ts"));

		for (const file of eventFiles) {
			const {default: EventHandler} = await import(`${rootFolder}/${file}`);

			const eventHandler = new EventHandler();

			if (eventHandler.isDisabled()) return;

			if (eventHandler.onlyOnce()) {
				client.once(eventHandler.event, (...args) => eventHandler.handle(...args));
			} else {
				client.on(eventHandler.event, (...args) => eventHandler.handle(...args));
			}
		}
	}
}

export default EventHandlersContainer;