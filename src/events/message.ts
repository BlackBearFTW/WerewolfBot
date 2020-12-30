import {Message} from "discord.js";
import {client} from "../index.js";
import {EventInterface} from "../interfaces/EventInterface";

export const event: EventInterface = {
    name: 'message',
    once: false,
    disabled: true,
    async execute(message: Message) {

        if (message.author.bot) return;

        await message.channel.send(`${message.author} has spoken!`)
    }
};