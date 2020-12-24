import {Message} from "discord.js";
import {CommandInterface} from "../interfaces/CommandInterface";
import {client} from "../index.js";

export const command: CommandInterface = {
    name: 'ping',
    execute(message: Message, args: string[]) {
        message.channel.send(`Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    }
};

