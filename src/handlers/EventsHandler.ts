import fs from "fs";
import {client} from "../index";

class EventsHandler {
    constructor(filePath: string) {
        const eventFiles = fs.readdirSync(filePath).filter((file: string) => file.endsWith('.js'));

        for (const file of eventFiles) {
            (async () => {
                const {event} = await import(`../${filePath}/${file}`); // Here we require the event file of the events folder
                if (event.disabled) return;
                client[event.once ? 'once' : 'on'](event.name, (...args) => event.execute(...args));
            })();
        }
    }
}

export default EventsHandler;