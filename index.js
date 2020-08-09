const mysql = require('mysql');
const fs = require('fs');
const Discord = require('discord.js');
const {
    prefix,
    token,
} = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

// GET ALL FILES IN COMMANDS FOLDER
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// ????
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// DATABASE CONNECTION
global.link = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "werewolfbot"
});

// IF THERE IS A CONNECTION ERRROR
link.connect(function (err) {
    if (err) console.log(err);
});

client.once('ready', () => {
    console.log('Ready!');
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

    if (client.commands.get(command).selfDestruct) {
        message.delete();
    }
});

client.login(token);