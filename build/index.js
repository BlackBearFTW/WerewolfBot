import fs from "fs";
import { Client, Collection } from 'discord.js';
import mysqlPromise from "mysql2/promise.js";
const prefix = '!w';
export const client = new Client();
export const commands = new Collection();
export const link = mysqlPromise.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
const commandFolders = fs.readdirSync('./commands', { withFileTypes: true }).filter(folder => folder.isDirectory()).map(folder => folder.name);
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
        (async () => {
            const { command } = await import(`./commands/${folder}/${file}`);
            commands.set(command.name, command);
        })();
    }
}
const eventFiles = fs.readdirSync(`./events`).filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
    (async () => {
        const { event } = await import(`./events/${file}`);
        client[event.once ? 'once' : 'on'](event.name, (...args) => event.execute(...args));
    })();
}
client.once('ready', () => {
    var _a, _b;
    console.log(`${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username} is ready!`);
    if (client.user === null)
        return;
    (_b = client.user) === null || _b === void 0 ? void 0 : _b.setActivity("with your fears", {
        type: "PLAYING",
    });
});
client.on('message', (message) => {
    var _a;
    if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type != 'text')
        return;
    let mContent = message.content;
    let args = mContent.match(/[^\s"]+|"([^"]*)"/gi);
    if (args === null)
        return;
    args = args.map((mContent) => mContent.replace(/^"(.+(?="$))"$/, '$1'));
    args.shift();
    const command = args.shift();
    if (!commands.has(command)) {
        return message.channel.send("Unknown command").then(msg => msg.delete({
            timeout: 5000
        }));
    }
    (_a = commands.get(command)) === null || _a === void 0 ? void 0 : _a.execute(message, args);
    message === null || message === void 0 ? void 0 : message.delete();
});
client === null || client === void 0 ? void 0 : client.login(process.env.BOT_TOKEN);
