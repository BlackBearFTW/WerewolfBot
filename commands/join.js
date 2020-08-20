module.exports = {
    name: 'join',
    selfDestruct: true,
    execute(message, args) {
        checkInActiveParty()

        function checkInActiveParty() {
            link.query(`SELECT games.GUILD_ID FROM games JOIN games_players ON games.GAME_ID = games_players.GAME_ID JOIN players ON games_players.USER_ID = players.USER_ID WHERE games.GUILD_ID = ${message.guild.id} AND players.DISCORD_USER_ID = ${message.author.id}`, (err, results) => {

                if (results.length > 0) {
                    message.reply("You are already part of an active game");
                } else {
                    checkIfGameExists();
                }
            });
        }

        function checkIfGameExists() {
            if (!args.length) {
                return message.channel.send('You need to mention a user to join');
            }
            //
            else if (args.length && args[0].replace(/\D/g, '') == message.mentions.users.first().id) {

                link.query(`SELECT games.GAME_ID FROM games JOIN games_players ON games.GAME_ID = games_players.GAME_ID JOIN players ON games_players.USER_ID = players.USER_ID WHERE players.DISCORD_USER_ID = ${message.mentions.users.first().id} AND games_players.LEADER = 1 AND games.GUILD_ID = ${message.guild.id}`, (err, results) => {

                    if (!results.length) {
                        message.reply(`This user does not have an active game`);
                    } else {
                        makePlayerJoin(results[0].GAME_ID);
                    }

                });
            }

        }

        function checkIfPlayerInDB() {
            let exists = false;
            link.query(`SELECT USER_ID FROM players WHERE DISCORD_USER_ID = ${message.author.id}`, (err, results) => {


                if (err) {
                    exists = true;
                    console.log(err)
                }

                if (results.length > 0) {
                    exists = true;
                }
            });

            return exists;
        }

        function makePlayerJoin(gameID) {
            if (!checkIfPlayerInDB()) {
                //  link.query(`INSERT INTO players (DISCORD_USER_ID) VALUES (${message.author.id})`);
            }

            link.query(`INSERT INTO games_players (GAME_ID, USER_ID) SELECT ${gameID}, players.USER_ID FROM players WHERE players.DISCORD_USER_ID = ${message.author.id}`);

            giveAccesToGameCategory(gameID);
        }

        function grantAcces(gameID) {
            link.query(`SELECT CATEGORY_ID FROM games WHERE GAME_ID = ${gameID}`, (err, results) => {

                client.channels.fetch(results[0].CATEGORY_ID).then(gameCategory => {
                    gameCategory.createOverwrite(message.author, {
                        VIEW_CHANNEL: true
                    });
                });


            });

            updateJoinMessage(gameID);
        }

        function updateJoinMessage(gameID) {
            link.query(`SELECT VILLAGE_CHANNEL_ID, JOIN_MESSAGE_ID FROM games WHERE GAME_ID = ${gameID}`, (err, results) => {

                client.channels.fetch(results[0].VILLAGE_CHANNEL_ID).then(lobbyChannel => {
                    lobbyChannel.messages.fetch(results[0].JOIN_MESSAGE_ID).then(joinMessage => {
                        let joinEmbed = joinMessage.embeds[0]

                        let = updatedEmbed = new Discord.MessageEmbed(joinEmbed).setDescription(getJoinMessageData(gameID));
                        joinMessage.edit(updatedEmbed);
                        // embeds[0].description + message.author.username + "\n";
                    })
                });
            });
        }

        function getJoinMessage(gameID) {
            let updatedDesc = '';
            link.query(`SELECT players.DISCORD_USER_ID FROM players JOIN games_players ON players.USER_ID = games_players.USER_ID WHERE GAME_ID = ${gameID} AND LEADER = 1`, (err, results) => {

                if (results.length > 0) {


                    for (const result of results) {
                        updatedDesc += client.users.fetch(result.DISCORD_USER_ID).then(user => {
                            updatedDesc += user.username + '(GameLeader) \n';
                            return updatedDesc;
                        });
                    }

                }
            });


            link.query(`SELECT players.DISCORD_USER_ID FROM players JOIN games_players ON players.USER_ID = games_players.USER_ID WHERE GAME_ID = ${gameID} AND LEADER = 0`, (err, results) => {


                if (results.length > 0) {


                    for (const result of results) {
                        updatedDesc += client.users.fetch(result.DISCORD_USER_ID).then(user => {
                            updatedDesc += user.username + '\n';
                            return updatedDesc
                        });
                    }

                }

            });

            console.log(updatedDesc)
            return updatedDesc
        }


    },
};