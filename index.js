const fs = require('fs');
const {
    prefix,
    token,
    db
} = require('./config.json');
const mysql = require('mysql2/promise');

global.Discord = require('discord.js');
global.client = new Discord.Client();
client.commands = new Discord.Collection();

global.link = mysql.createPool({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database,
});
// GET ALL FILES IN COMMANDS FOLDER
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}


client.once('ready', () => {
    console.log('Ready!');

    client.user.setActivity("with your fears", {
        type: "PLAYING",
    });
});


client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    let mContent = message.content;

    let args = mContent.match(/[^\s"]+|"([^"]*)"/gi).map((mContent) => mContent.replace(/^"(.+(?="$))"$/, '$1'));
    args.shift()
    const command = args.shift();

    if (!client.commands.has(command)) {
        return message.channel.send("Unknown command");
    }
    client.commands.get(command).execute(message, args);
    message.delete();
});


client.login(token);