import {client} from "../index";
import {status} from "../config.json";
import {EventInterface} from "../interfaces/EventInterface";
import {ActivityType} from "discord.js";

export const event: EventInterface = {
	name: "ready",
	once: true,
	disabled: false,
	async execute() {
		console.log(`${client.user?.username} is ready!`);

		if (client.user === null) return;

		client.user?.setActivity(status.message, {
			type: status.type as ActivityType
		});
	}
};