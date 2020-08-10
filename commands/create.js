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
    name: 'create',
    description: 'Create a new game',
    selfDestruct: true,
    execute(message, args) {

        link.query(`SELECT games_players.USER_ID FROM games_players, players WHERE games_players.USER_ID = players.USER_ID AND games_players.LEADER = 1 AND players.DISCORD_USER_ID = ${message.author.id}`, (err, results) => {

            if (results.length > 0) {
                return message.channel.send("<@" + message.author.id + "> You already have an active game");
            } else {
                createGameCategory();
            }
        });

        function createGameCategory(params) {
            message.guild.channels.create(`${message.author.username}'s GAME`, {
                type: 'category',
                permissionOverwrites: [{
                    id: message.guild.roles.everyone.id,
                    deny: ['VIEW_CHANNEL'],
                }, {
                    id: message.author.id,
                    allow: ['VIEW_CHANNEL'],
                }]
            }).then(gameCategory => createChannels(gameCategory));
        }


        // CREATE CATEGORY AND THEN CREATE LOBBY, MOVES AND VOICE CHANNEL INSIDE
        function createChannels(gameCategory) {
            Promise.all([
                message.guild.channels.create(`🔑 LOBBY`, {
                    type: 'text',
                    parent: gameCategory.id
                }).then(lobbyChannel => {
                    return lobbyChannel
                }),

                message.guild.channels.create(`🎲 MOVES`, {
                    type: 'text',
                    parent: gameCategory.id,
                    permissionOverwrites: [{
                        id: message.guild.roles.everyone.id,
                        deny: ['VIEW_CHANNEL'],
                    }]
                }).then(movesChannel => {
                    return movesChannel
                }),

                message.guild.channels.create(`🔊 VOICE CHANNEL`, {
                    type: 'text',
                    parent: gameCategory.id
                }).then(voiceChannel => {
                    return voiceChannel
                }),


            ]).then(([lobbyChannel, movesChannel, voiceChannel]) => {

                const embed = new Discord.MessageEmbed();
                embed.setTitle("Nobody invited yet!");
                embed.setDescription("Use `!w invite @mention` to invite people to your game!")

                lobbyChannel.send({
                    embed
                }).then(inviteMessage => {
                    inviteMessage.pin().then(lobbyChannel.bulkDelete(1));

                    insertGameInDB(lobbyChannel.id, movesChannel.id, voiceChannel.id, gameCategory.id, inviteMessage.id);
                });
            });
        }

        function insertGameInDB(lobbyChannelID, movesChannelID, voiceChannelID, gameCategoryID, inviteMessageID) {
            link.query(`INSERT IGNORE INTO players (DISCORD_USER_ID) VALUES (${message.author.id})`);
            link.query(`INSERT INTO games (GUILD_ID, CATEGORY_ID, VILLAGE_CHANNEL_ID, MOVES_CHANNEL_ID, VOICE_CHANNEL_ID, INVITE_MESSAGE_ID) VALUES (${message.guild.id}, ${gameCategoryID}, ${lobbyChannelID}, ${movesChannelID}, ${voiceChannelID}, ${inviteMessageID})`);
            link.query(`INSERT INTO games_players (GAME_ID, USER_ID, STATUS, LEADER) SELECT games.GAME_ID, players.USER_ID, "A", true FROM games, players WHERE games.VILLAGE_CHANNEL_ID = ${lobbyChannelID} AND players.DISCORD_USER_ID = ${message.author.id}`);
        }
    },
};