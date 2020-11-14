const {Discord, client, link} = require('/index');

class Match {
    
    constructor(message, args) {
        this.message = message;
        this.args = args;
    }


     async createMatch() {
        const matchCategory = await this.createCategory();
        const matchChannels = await this.createChannels(matchCategory);
        const joinMessage = await this.sendJoinMessage(matchChannels.lobbyChannel);
        this.id = await this.insertMatch(matchCategory.id, matchChannels.lobbyChannel.id, matchChannels.movesChannel.id, matchChannels.voiceChannel.id, joinMessage.id)
        await this.addUser(this.message.author, true);
        return this.id;
    }

     async createCategory() {
        return await this.message.guild.channels.create(`WEREWOLF MATCH: ${this.message.author.username}`, {
            type: 'category',
            permissionOverwrites: [{
                id: this.message.guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL'],
            }]
        });
    }

     async createChannels(matchCategory) {

        const lobbyChannel = await this.message.guild.channels.create(`🔑-lobby`, {
            type: 'text',
            parent: matchCategory.id
        }).then(lobbyChannel => {
            return lobbyChannel
        });

        const movesChannel = await this.message.guild.channels.create(`🎲-moves`, {
            type: 'text',
            parent: matchCategory.id,
            permissionOverwrites: [{
                id: this.message.guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
            }]
        }).then(movesChannel => {
            return movesChannel
        });

        const voiceChannel = await this.message.guild.channels.create(`🎤-voice`, {
            type: 'voice',
            parent: matchCategory.id
        }).then(voiceChannel => {
            return voiceChannel
        });

        return { lobbyChannel, movesChannel, voiceChannel };
    }

     async sendJoinMessage(lobbyChannel) {

        const embed = new Discord.MessageEmbed();
        embed.setTitle("You're all by yourself! Find at least 7 other users to start the match");
        embed.setDescription("```css\n" + `${this.message.author.username} (MatchLeader)\n` + "```");
        embed.setColor('#ff861f');


        const joinMessage = await lobbyChannel.send(embed);
        await joinMessage.pin();
        await lobbyChannel.bulkDelete(1);

        return joinMessage
    }

     async insertMatch(guildID, categoryID, lobbyChannelID, movesChannelID, voiceChannelID, joinMessageID) {
        let [results] = await link.execute(`INSERT INTO matches (GUILD_ID, CATEGORY_ID, VILLAGE_CHANNEL_ID, MOVES_CHANNEL_ID, VOICE_CHANNEL_ID, JOIN_MESSAGE_ID) VALUES (?, ?, ?, ?, ?, ?)`, [guildID, categoryID, lobbyChannelID, movesChannelID, voiceChannelID, joinMessageID]);

        return results.insertId;
    }

     async updateJoinMessage( ) {
        let updatedDesc = '```css\n';
        let joinCount = 0;
        let [results] = await link.execute(`SELECT GUILD_ID, VILLAGE_CHANNEL_ID, JOIN_MESSAGE_ID FROM matches WHERE MATCH_ID = ?`, [matchID]);
        const guild = await this.message.guild;
        const lobbyChannel = await client.channels.fetch(results[0].VILLAGE_CHANNEL_ID);
        const fetchedMessage = await lobbyChannel.this.messages.fetch(results[0].JOIN_MESSAGE_ID);


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
        } else if (joinCount < 8) {
            embed.setTitle(`You need at least 8 users, currently there are ${joinCount} users`);
        } else {
            embed.setTitle(`There are currently ${joinCount} users in this match`);
        }

        embed.setDescription(updatedDesc);
        embed.setColor('#ff861f');
        await fetchedMessage.edit(embed);
    }

     async statusCheck(matchID) {
        let [results] = await link.execute(`SELECT STARTED FROM matches WHERE MATCH_ID = ?`, [matchID]);

        return results[0].STARTED !== 0;
    }

     async getUsers() {
        let [results] = await link.execute(`SELECT USER_ID FROM matches_players WHERE MATCH_ID = ?`, [this.id]);
        let userList = []

        results.forEach(result => {
            userList.push(result.USER_ID);
        })

        return userList;
    }

    async addUser(user, leader = false) {
        await link.execute(`INSERT INTO matches_users (USER_ID, MATCH_ID, LEADER) VALUES (?, ?, ?)`, [userID, this.id, leader]);

        let [results] = await link.execute(`SELECT CATEGORY_ID, VILLAGE_CHANNEL_ID FROM matches WHERE MATCH_ID = ?`, [this.id]);

        await client.channels.fetch(results[0].CATEGORY_ID).then(matchCategory => {
            matchCategory.createOverwrite(message.author, {
                VIEW_CHANNEL: true
            });
        });

        await client.channels.fetch(results[0].VILLAGE_CHANNEL_ID).then(lobbyChannel => {
            lobbyChannel.send(`<@${message.author.id}>`).then(quickMention => {
                quickMention.delete();
            });
        });
    }

    async removeUser(user) {
        const [results] = await link.execute(`SELECT * FROM games WHERE MATCH_ID = ?`, [this.id]);

        if (!results.length) {
            return message.reply("Match not found. ");
        }

        await link.execute(`DELETE FROM matches_users WHERE USER_ID = ? AND MATCH_ID = ?`, [user.id, this.id]);

        await client.channels.fetch(results[0].CATEGORY_ID).then(matchCategory => {
            matchCategory.createOverwrite(user, {
                VIEW_CHANNEL: false
            });
        });
    }

}

module.exports = Match