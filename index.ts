const fs = require('fs');
const mysql = require('mysql2/promise');
const prefix = '!w';

interface CommandInterface {
    name: string;
    description: string;
    execute(message: discord.Message, args: string[]): void;
}

import discord = require("discord.js");
const client = new discord.Client();
const commands = new discord.Collection<string, CommandInterface>();

export const link = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

module.exports = {client, link};


// GET ALL FILES IN COMMANDS FOLDER
const commandFiles = fs.readdirSync('./src/commands').filter((file: string) => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    commands.set(command.name, command);
}


client.once('ready', () => {
    console.log('Ready!');

    if (client.user === null) return;

    client.user.setActivity("with your fears", {
        type: "PLAYING",
    });
});


client.on('message', message => {
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
    message.delete();
});


client.login(process.env.BOT_TOKEN);