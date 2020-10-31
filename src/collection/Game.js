
const Game = {
    getGame: async function (guildID, CategoryID) {
        let [results] = await link.execute(`SELECT GAME_ID FROM games WHERE GUILD_ID = ? AND CATEGORY_ID = ?`, [guildID, CategoryID]);

        if (results.length > 0) {
            return results[0];
        } else {
            return false;
        }
    },

    createGame: async function (message) {
        const gameCategory = await this.createCategory(message);
        const gameChannels = await this.createChannels(message, gameCategory);
        const joinMessage = await this.sendJoinMessage(message, gameChannels.lobbyChannel);
        const gameID = await this.insertGame(message.guild.id, gameCategory.id, gameChannels.lobbyChannel.id, gameChannels.movesChannel.id, gameChannels.voiceChannel.id, joinMessage.id);
        return gameID
    },

    createCategory: async function (message) {
        const gameCategory = await message.guild.channels.create(`WEREWOLF GAME: ${message.author.username}`, {
            type: 'category',
            permissionOverwrites: [{
                id: message.guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL'],
            }]
        });

        return gameCategory;
    },

    createChannels: async function (message, gameCategory) {

        const lobbyChannel = await message.guild.channels.create(`🔑-lobby`, {
            type: 'text',
            parent: gameCategory.id
        }).then(lobbyChannel => {
            return lobbyChannel
        });

        const movesChannel = await message.guild.channels.create(`🎲-moves`, {
            type: 'text',
            parent: gameCategory.id,
            permissionOverwrites: [{
                id: message.guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
            }]
        }).then(movesChannel => {
            return movesChannel
        });

        const voiceChannel = await message.guild.channels.create(`🎤-voice`, {
            type: 'voice',
            parent: gameCategory.id
        }).then(voiceChannel => {
            return voiceChannel
        });

        const gameChannels = {
            lobbyChannel: lobbyChannel,
            movesChannel: movesChannel,
            voiceChannel: voiceChannel
        }
        return gameChannels
    },

    sendJoinMessage: async function (message, lobbyChannel) {

        const embed = new Discord.MessageEmbed();
        embed.setTitle("Your all by yourself! Find atleast 7 other players to start the game");
        embed.setDescription("```css\n" + `${message.author.username} (GameLeader)\n` + "```");
        embed.setColor('#ff861f');


        const joinMessage = await lobbyChannel.send(embed);
        await joinMessage.pin();
        await lobbyChannel.bulkDelete(1);

        return joinMessage
    },

    insertGame: async function (guildID, categoryID, lobbyChannelID, movesChannelID, voiceChannelID, joinMessageID) {
        let [results] = await link.execute(`INSERT INTO games (GUILD_ID, CATEGORY_ID, VILLAGE_CHANNEL_ID, MOVES_CHANNEL_ID, VOICE_CHANNEL_ID, JOIN_MESSAGE_ID) VALUES (?, ?, ?, ?, ?, ?)`, [guildID, categoryID, lobbyChannelID, movesChannelID, voiceChannelID, joinMessageID]);

        return results.insertId;
    },

    updateJoinMessage: async function (message, gameID) {
        let updatedDesc = '```css\n';
        let joinCount = 0;
        let [results] = await link.execute(`SELECT GUILD_ID, VILLAGE_CHANNEL_ID, JOIN_MESSAGE_ID FROM games WHERE GAME_ID = ?`, [gameID]);
        const guild = await message.guild;
        const lobbyChannel = await client.channels.fetch(results[0].VILLAGE_CHANNEL_ID);
        const fetchedMessage = await lobbyChannel.messages.fetch(results[0].JOIN_MESSAGE_ID);


        let [leaderResults] = await link.execute(`SELECT DISCORD_USER_ID FROM players JOIN games_players ON players.PLAYER_ID = games_players.PLAYER_ID WHERE games_players.LEADER = 1 AND games_players.GAME_ID = ?`, [gameID]);

        for (let i = 0; i < leaderResults.length; i++) {
            let joinedPlayer = await guild.members.fetch(leaderResults[i].DISCORD_USER_ID);
            updatedDesc += joinedPlayer.user.username + ' (GAMELEADER)\n';
            joinCount++
        }

        let [playerResults] = await link.execute(`SELECT DISCORD_USER_ID FROM players JOIN games_players ON players.PLAYER_ID = games_players.PLAYER_ID WHERE games_players.LEADER = 0 AND games_players.GAME_ID = ?`, [gameID]);

        for (let i = 0; i < playerResults.length; i++) {
            let joinedPlayer = await guild.members.fetch(playerResults[i].DISCORD_USER_ID);
            updatedDesc += joinedPlayer.user.username + '\n';
            joinCount++
        }
        updatedDesc += '```';

        let embed = new Discord.MessageEmbed();

        if (joinCount == 1) {
            embed.setTitle("Your all by yourself! Find atleast 7 other players to start the game");
        } else if (joinCount < 8) {
            embed.setTitle(`You need atleast 8 players, currently there are ${joinCount} players`);
        } else {
            embed.setTitle(`There are currently ${joinCount} players in this game`);
        }

        embed.setDescription(updatedDesc);
        embed.setColor('#ff861f');
        fetchedMessage.edit(embed);
    },

    statusCheck: async function (gameID) {
        let [results] = await link.execute(`SELECT STARTED FROM games WHERE GAME_ID = ?`, [gameID]);

        if (results[0].STARTED == 0) {
            return false;
        } else {
            return true;
        }
    },

    getPlayers: async function (gameID) {
        let [results] = await link.execute(`SELECT players.DISCORD_USER_ID FROM players JOIN games_players ON players.PLAYER_ID = games_players.PLAYER_ID WHERE games_players.GAME_ID = ?`, [gameID]);
        let playerList = []

        results.forEach(result => {
            playerList.push(result.DISCORD_USER_ID);
        })

        return playerList;
    }
}

module.exports = Game;