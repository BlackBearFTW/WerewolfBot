const fs = require('fs');
const mysql = require('mysql2/promise');
const prefix = '!w';

global.Discord = require('discord.js');
global.client = new Discord.Client();
client.commands = new Discord.Collection();

global.link = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
// GET ALL FILES IN COMMANDS FOLDER
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./src/commands`);
    client.commands.set(command.name, command);
}


client.once('ready', () => {
    console.log('Ready!');
    client.user.setActivity("with your fears", {
        type: "PLAYING",
    });
});


client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type != 'text') return;

    let mContent = message.content;

    let args = mContent.match(/[^\s"]+|"([^"]*)"/gi).map((mContent) => mContent.replace(/^"(.+(?="$))"$/, '$1'));
    args.shift()
    const command = args.shift();

    if (!client.commands.has(command)) {
        return message.channel.send("Unknown command").then(msg => msg.delete({
            timeout: 5000
        }));
    }
    client.commands.get(command).execute(message, args);
    message.delete();
});


client.login(process.env.BOT_TOKEN);