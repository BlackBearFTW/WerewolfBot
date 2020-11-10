class Match {

    static async getMatch(guildID, CategoryID) {
        let [results] = await link.execute(`SELECT MATCH_ID FROM matches WHERE GUILD_ID = ? AND CATEGORY_ID = ?`, [guildID, CategoryID]);

        if (results.length > 0) {
            return results[0];
        } else {
            return false;
        }
    }

    static async createMatch(message) {
        const matchCategory = await this.createCategory(message);
        const matchChannels = await this.createChannels(message, matchCategory);
        const joinMessage = await this.sendJoinMessage(message, matchChannels.lobbyChannel);
        return await this.insertMatch(message.guild.id, matchCategory.id, matchChannels.lobbyChannel.id, matchChannels.movesChannel.id, matchChannels.voiceChannel.id, joinMessage.id)
    }

    static async createCategory(message) {
        return await message.guild.channels.create(`WEREWOLF MATCH: ${message.author.username}`, {
            type: 'category',
            permissionOverwrites: [{
                id: message.guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL'],
            }]
        });
    }

    static async createChannels(message, matchCategory) {

        const lobbyChannel = await message.guild.channels.create(`🔑-lobby`, {
            type: 'text',
            parent: matchCategory.id
        }).then(lobbyChannel => {
            return lobbyChannel
        });

        const movesChannel = await message.guild.channels.create(`🎲-moves`, {
            type: 'text',
            parent: matchCategory.id,
            permissionOverwrites: [{
                id: message.guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
            }]
        }).then(movesChannel => {
            return movesChannel
        });

        const voiceChannel = await message.guild.channels.create(`🎤-voice`, {
            type: 'voice',
            parent: matchCategory.id
        }).then(voiceChannel => {
            return voiceChannel
        });

        return {
            lobbyChannel: lobbyChannel,
            movesChannel: movesChannel,
            voiceChannel: voiceChannel
        }
    }

    static async sendJoinMessage(message, lobbyChannel) {

        const embed = new Discord.MessageEmbed();
        embed.setTitle("Your all by yourself! Find at least 7 other users to start the match");
        embed.setDescription("```css\n" + `${message.author.username} (MatchLeader)\n` + "```");
        embed.setColor('#ff861f');


        const joinMessage = await lobbyChannel.send(embed);
        await joinMessage.pin();
        await lobbyChannel.bulkDelete(1);

        return joinMessage
    }

    static async insertMatch(guildID, categoryID, lobbyChannelID, movesChannelID, voiceChannelID, joinMessageID) {
        let [results] = await link.execute(`INSERT INTO matches (GUILD_ID, CATEGORY_ID, VILLAGE_CHANNEL_ID, MOVES_CHANNEL_ID, VOICE_CHANNEL_ID, JOIN_MESSAGE_ID) VALUES (?, ?, ?, ?, ?, ?)`, [guildID, categoryID, lobbyChannelID, movesChannelID, voiceChannelID, joinMessageID]);

        return results.insertId;
    }

    static async updateJoinMessage(message, matchID) {
        let updatedDesc = '```css\n';
        let joinCount = 0;
        let [results] = await link.execute(`SELECT GUILD_ID, VILLAGE_CHANNEL_ID, JOIN_MESSAGE_ID FROM matches WHERE MATCH_ID = ?`, [matchID]);
        const guild = await message.guild;
        const lobbyChannel = await client.channels.fetch(results[0].VILLAGE_CHANNEL_ID);
        const fetchedMessage = await lobbyChannel.messages.fetch(results[0].JOIN_MESSAGE_ID);


        let [leaderResults] = await link.execute(`SELECT DISCORD_USER_ID FROM users JOIN matches_users ON users.USER_ID = matches_users.USER_ID WHERE matches_users.LEADER = 1 AND matches_users.MATCH_ID = ?`, [matchID]);

        for (let i = 0; i < leaderResults.length; i++) {
            let joinedUser = await guild.members.fetch(leaderResults[i].DISCORD_USER_ID);
            updatedDesc += joinedUser.user.username + ' (MATCHLEADER)\n';
            joinCount++
        }

        let [userResults] = await link.execute(`SELECT DISCORD_USER_ID FROM users JOIN matches_users ON users.USER_ID = matches_users.USER_ID WHERE matches_users.LEADER = 0 AND matches_users.MATCH_ID = ?`, [matchID]);

        for (let i = 0; i < userResults.length; i++) {
            let joinedUser = await guild.members.fetch(userResults[i].DISCORD_USER_ID);
            updatedDesc += joinedUser.user.username + '\n';
            joinCount++
        }
        updatedDesc += '```';

        let embed = new Discord.MessageEmbed();

        if (joinCount === 1) {
            embed.setTitle("Your all by yourself! Find at least 7 other users to start the match");
        }  else if (joinCount < 8) {
            embed.setTitle(`You need at least 8 users, currently there are ${joinCount} users`);
        } else {
            embed.setTitle(`There are currently ${joinCount} users in this match`);
        }

        embed.setDescription(updatedDesc);
        embed.setColor('#ff861f');
        fetchedMessage.edit(embed);
    }

    static async statusCheck(matchID) {
        let [results] = await link.execute(`SELECT STARTED FROM matches WHERE MATCH_ID = ?`, [matchID]);

        return results[0].STARTED !== 0;
    }

    static async getUsers(matchID) {
        let [results] = await link.execute(`SELECT users.DISCORD_USER_ID FROM users JOIN matches_users ON users.USER_ID = matches_users.USER_ID WHERE matches_users.MATCH_ID = ?`, [matchID]);
        let userList = []

        results.forEach(result => {
            userList.push(result.DISCORD_USER_ID);
        })

        return userList;
    }

}

module.exports = Match