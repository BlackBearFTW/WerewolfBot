import {BitFieldResolvable, Client, Intents, IntentsString} from "discord.js";

class DiscordUtil {
	private static client: Client | null = null;

	static getAllIntents(): BitFieldResolvable<IntentsString, number> {
		// Stole... copied from an older version of discord.js...
		// https://github.com/discordjs/discord.js/blob/51551f544b80d7d27ab0b315da01dfc560b2c115/src/util/Intents.js#L75
		return Object.values(Intents.FLAGS).reduce((acc, p) => acc | p, 0);
	}

	static getClient(): Client {
		if (!this.client) throw new Error("Client has not been set.");
		return this.client;
	}

	static setClient(client: Client): void {
		this.client = client;
	}
}

export default DiscordUtil;