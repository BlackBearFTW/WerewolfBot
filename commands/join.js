const mysql = require('mysql');
const Discord = require('discord.js');
const client = new Discord.Client();
const {
    db
} = require('../config.json');

const link = mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database,
});

module.exports = {
    name: 'join',
    description: 'join the game',
    selfDestruct: true,
    execute(message, args) {
        link.query(`SELECT games.GUILD_ID FROM games JOIN games_players ON games.GAME_ID = games_players.GAME_ID JOIN players ON games_players.USER_ID = players.USER_ID WHERE games.GUILD_ID = ${message.guild.id} AND players.DISCORD_USER_ID = ${message.author.id}`, (err, results) => {

            if (results.length > 0) {
                return message.channel.send("<@" + message.author.id + "> You are already part of an active game");
            } else {

                if (!args.length) {
                    return message.channel.send('You need to mention a user to join');
                }
                //
                else if (args.length && args[0].replace(/\D/g, '') == message.mentions.users.first().id) {

                    link.query(`SELECT games.GAME_ID FROM games JOIN games_players ON games.GAME_ID = games_players.GAME_ID JOIN players ON games_players.USER_ID = players.USER_ID WHERE players.DISCORD_USER_ID = ${message.mentions.users.first().id} AND games_players.LEADER = 1 AND games.GUILD_ID = ${message.guild.id}`, (err, results) => {

                        if (!results.length) {
                            return message.channel.send(`This user does not have an active game`);
                        } else {
                            link.query(`INSERT INTO games_players (GAME_ID, USER_ID) SELECT`)
                        }

                    });
                }
                //             link.query(`INSERT IGNORE INTO players (DISCORD_USER_ID) VALUES (${message.mentions.users.first().id})`);
                //             link.query(`INSERT INTO games_players (GAME_ID, USER_ID, STATUS) SELECT games.GAME_ID, players.USER_ID, "P" FROM games, players WHERE games.VILLAGE_CHANNEL_ID = ${message.channel.id} AND players.DISCORD_USER_ID = ${message.mentions.users.first().id}`);

                //             link.query(`SELECT GAME_ID, INVITE_MESSAGE_ID FROM games WHERE VILLAGE_CHANNEL_ID = ${message.channel.id}`, (err, results) => {

                //                 message.channel.messages.fetch(results[0].INVITE_MESSAGE_ID)
                //                     .then(invite => {
                //                         invite.edit("This fetched message was edited");
                //                     });
                //             });

                //         }



            }


        });
    },
};