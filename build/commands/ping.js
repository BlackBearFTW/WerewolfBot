import { client } from "../index";
export default {
    name: 'ping',
    execute(message, args) {
        message.channel.send(`🏓Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    }
};
const command = {};
