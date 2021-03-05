import {Message} from "discord.js";
import {client} from "../index.js";
import {EventInterface} from "../interfaces/EventInterface";

export const event: EventInterface = {
    name: 'ready',
    once: true,
    disabled: false,
    async execute() {
        console.log(`${client.user?.username} is ready!`);

        if (client.user === null) return;

        client.user?.setActivity("with your fears", {
            type: "PLAYING",
        });
    }
};