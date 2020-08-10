const mysql = require('mysql');
const Discord = require('discord.js');
const client = new Discord.Client();

const link = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "werewolfbot"

});
module.exports = {
    name: 'invite',
    description: 'Invite player to game',
    selfDestruct: true,
    execute(message, args) {
        link.query(`SELECT games.VILLAGE_CHANNEL_ID FROM games, games_players, players WHERE games.GAME_ID = games_players.GAME_ID AND games_players.USER_ID = players.USER_ID AND players.DISCORD_USER_ID = ${message.author.id} AND games_players.LEADER = 1`)
    },
};