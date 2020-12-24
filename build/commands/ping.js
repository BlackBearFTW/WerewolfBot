import { client } from "../index.js";
export const command = {
    name: 'ping',
    execute(message, args) {
        message.channel.send(`Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    }
};
