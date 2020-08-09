module.exports = {
    name: 'create',
    description: 'Create a new game',
    selfDestruct: true,
    execute(message, args) {

        // link.query(`SELECT USER_ID FROM games_players, players WHERE games_players.USER_ID = players.USER_ID AND games_players.LEADER = 1 AND players.DISCORD_USER_ID = ${message.author.id}`, (err, results) => {

        //     if (results.length) {
        //         return message.channels.send("<@" + message.author.id + "> You already have an active game");
        //     }
        // });


        link.query(`INSERT IGNORE INTO players (DISCORD_USER_ID) VALUES (${message.author.id})`);




        // CREATE CATEGORY AND THEN CREATE LOBBY, MOVES AND VOICE CHANNEL INSIDE
        message.guild.channels.create(`${message.author.username}'s GAME`, {
            type: 'category',
            permissionOverwrites: [{
                id: message.guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL'],
            }, {
                id: message.author.id,
                allow: ['VIEW_CHANNEL'],
            }]
        }).then(gameCategory => {

            Promise.all([
                message.guild.channels.create(`🔑 LOBBY`, {
                    type: 'text',
                    parent: gameCategory.id
                }).then(lobbyChannel => {
                    return lobbyChannel.id
                }),

                message.guild.channels.create(`🎲 MOVES`, {
                    type: 'text',
                    parent: gameCategory.id,
                    permissionOverwrites: [{
                        id: message.guild.roles.everyone.id,
                        deny: ['VIEW_CHANNEL'],
                    }]
                }).then(movesChannel => {
                    return movesChannel.id
                }),

                message.guild.channels.create(`🔊 VOICE CHANNEL`, {
                    type: 'text',
                    parent: gameCategory.id
                }).then(voiceChannel => {
                    return voiceChannel.id
                })

            ]).then(([lobbyChannelID, movesChannelID, voiceChannelID]) => {
                console.log(lobbyChannelID);

                // INSERT INTO DATABASE
            });


        });

    },
};