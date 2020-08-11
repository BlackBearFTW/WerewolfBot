const mysql = require('mysql');
const Discord = require('discord.js');
const {
    db
} = require('../config.json');
const client = new Discord.Client();

const link = mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database,
});

module.exports = {
    name: 'create',
    description: 'Create a new game',
    selfDestruct: true,
    execute(message, args) {

        link.query(`SELECT games.GUILD_ID FROM games JOIN games_players ON games.GAME_ID = games_players.GAME_ID JOIN players ON games_players.USER_ID = players.USER_ID WHERE games.GUILD_ID = ${message.guild.id} AND players.DISCORD_USER_ID = ${message.author.id}`, (err, results) => {

            if (results.length > 0) {
                return message.channel.send("<@" + message.author.id + "> You are already part of an active game");
            } else {
                createGameCategory();
            }
        });

        function createGameCategory() {
            message.guild.channels.create(`WEREWOLF GAME: ${message.author.username}`, {
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
                embed.setTitle("Joined players (1/6)");
                embed.setDescription("```" + `${message.author.username}(GameLeader)\n` + "```");

                lobbyChannel.send({
                    embed
                }).then(inviteMessage => {
                    inviteMessage.pin();
                    // FIXME REMOVE THE 'WEREWOLF PINNED A MESSAGE' MESSAGE .then(lobbyChannel.bulkDelete(1));

                    insertGameInDB(lobbyChannel.id, movesChannel.id, voiceChannel.id, gameCategory.id, inviteMessage.id);
                });
            });
        }

        function insertGameInDB(lobbyChannelID, movesChannelID, voiceChannelID, gameCategoryID, inviteMessageID) {
            link.query(`INSERT IGNORE INTO players (DISCORD_USER_ID) VALUES (${message.author.id})`);
            link.query(`INSERT INTO games (GUILD_ID, CATEGORY_ID, VILLAGE_CHANNEL_ID, MOVES_CHANNEL_ID, VOICE_CHANNEL_ID, INVITE_MESSAGE_ID) VALUES (${message.guild.id}, ${gameCategoryID}, ${lobbyChannelID}, ${movesChannelID}, ${voiceChannelID}, ${inviteMessageID})`);
            link.query(`INSERT INTO games_players (GAME_ID, USER_ID, LEADER) SELECT games.GAME_ID, players.USER_ID, "A" FROM games, players WHERE games.VILLAGE_CHANNEL_ID = ${lobbyChannelID} AND players.DISCORD_USER_ID = ${message.author.id}`);
        }
    },
};