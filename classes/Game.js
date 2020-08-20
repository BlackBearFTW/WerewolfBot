class Game {

    static async createGame(message) {
        const gameCategory = await this.createCategory(message);
        const gameChannels = await this.createChannels(message, gameCategory);
        const joinMessage = await this.sendJoinMessage(message, gameChannels.lobbyChannel);
        const gameID = await this.insertGame(message.guild.id, gameCategory.id, gameChannels.lobbyChannel.id, gameChannels.movesChannel.id, gameChannels.voiceChannel.id, joinMessage.id);
        return gameID
    }

    static async createCategory(message) {
        const gameCategory = await message.guild.channels.create(`WEREWOLF GAME: ${message.author.username}`, {
            type: 'category',
            permissionOverwrites: [{
                id: message.guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL'],
            }]
        });

        return gameCategory;
    }

    static async createChannels(message, gameCategory) {

        const lobbyChannel = await message.guild.channels.create(`🔑 LOBBY`, {
            type: 'text',
            parent: gameCategory.id
        }).then(lobbyChannel => {
            return lobbyChannel
        });

        const movesChannel = await message.guild.channels.create(`🎲 MOVES`, {
            type: 'text',
            parent: gameCategory.id,
            permissionOverwrites: [{
                id: message.guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
            }]
        }).then(movesChannel => {
            return movesChannel
        });

        const voiceChannel = await message.guild.channels.create(`🔊 VOICE CHANNEL`, {
            type: 'text',
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
    }

    static async sendJoinMessage(message, lobbyChannel) {

        const embed = new Discord.MessageEmbed();
        embed.setTitle("Joined players (1/6)");
        embed.setDescription("```" + `${message.author.username} (GameLeader)\n` + "```");


        const joinMessage = await lobbyChannel.send(embed);
        await joinMessage.pin();
        await lobbyChannel.bulkDelete(1);

        return joinMessage
    }

    static async insertGame(guildID, categoryID, lobbyChannelID, movesChannelID, voiceChannelID, joinMessageID) {
        let [results] = await link.execute(`INSERT INTO games (GUILD_ID, CATEGORY_ID, VILLAGE_CHANNEL_ID, MOVES_CHANNEL_ID, VOICE_CHANNEL_ID, JOIN_MESSAGE_ID) VALUES (?, ?, ?, ?, ?, ?)`, [guildID, categoryID, lobbyChannelID, movesChannelID, voiceChannelID, joinMessageID]);

        return results.insertId;
    }

    static async updateJoinMessage(gameID) {

    }
}

module.exports = Game