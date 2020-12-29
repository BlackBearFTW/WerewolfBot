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


// // Retrieves all the event handlers and imports those.
// fs.readdir('./events/', (err, files) => { // We use the method readdir to read what is in the events folder
//
//     files.forEach(async (file) => {
//         const eventFunction = await import(`./events/${file}`); // Here we require the event file of the events folder
//         client[eventFunction.once ? 'once' : 'on'](eventFunction.name, (...args) => eventFunction.run(...args)); // Run the event using the above defined emitter (client)
//     });
// });

const eventFiles = fs.readdirSync(`./events`).filter((file: string) => file.endsWith('.js'));

for (const file of eventFiles) {
    (async () => {
        const {event} = await import(`./events/${file}`); // Here we require the event file of the events folder
        client[event.once ? 'once' : 'on'](event.name, (...args) => event.execute(...args)); // Run the event using the above defined emitter (client)
    })();
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