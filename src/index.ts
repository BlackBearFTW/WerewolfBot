import fs from "fs";
import {Message, Client, Collection} from 'discord.js';
import {CommandInterface} from "./interfaces/CommandInterface";
import mysqlPromise from "mysql2/promise.js";

const prefix = '!w';

export const client = new Client();
export const commands = new Collection<string, CommandInterface>();

export const link = mysqlPromise.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Retrieves all folders inside the commands folder and then the files inside those folders get imported
const commandFolders = fs.readdirSync('./commands', {withFileTypes: true}).filter(folder => folder.isDirectory()).map(folder => folder.name);

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file: string) => file.endsWith('.js'));

    for (const file of commandFiles) {
        (async () => {
            const {command} = await import(`./commands/${folder}/${file}`);
            commands.set(command.name, command);
        })();
    }
}

client.once('ready', () => {
    console.log(`${client.user?.username} is ready!`);

    if (client.user === null) return;

    client.user?.setActivity("with your fears", {
        type: "PLAYING",
    });
});


client.on('message', (message: Message) => {
    if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type != 'text') return;

    let mContent: string = message.content;
    let args = mContent.match(/[^\s"]+|"([^"]*)"/gi);

    if (args === null) return;

    args = args.map((mContent) => mContent.replace(/^"(.+(?="$))"$/, '$1'));

    args.shift();
    const command: string = args.shift()!;

    if (!commands.has(command)) {
        return message.channel.send("Unknown command").then(msg => msg.delete({
            timeout: 5000
        }));
    }

    commands.get(command)?.execute(message, args);
    message?.delete();
});


client?.login(process.env.BOT_TOKEN);