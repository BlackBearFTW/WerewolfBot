import {Message, MessageEmbed, Channel, CategoryChannel, User} from "discord.js";
import {client, link} from "../../index.js";

class Match {
    private message: Message;
    private args: string[];
    id: number;

    constructor(message: Message, args: string[]) {
        this.message = message;
        this.args = args;
        this.id = -1;
    }

// Saving channels is unnecessary (so is the join message) instead just use this code:
    /*    const channelMap = message.channel.parent.children; // get category
        const fetchedChannel = channelMap.array()[0]; // get first channel in category (lobby)
        const fetchedMessages = await fetchedChannel.messages.fetch({after: '1', limit: 1}); // get a map with the first message

        const embed = new Discord.MessageEmbed();
        embed.setTitle("You're all by yourself! Find at least 7 other users to start the match");
        embed.setDescription("```css\n" + `${message.author.username} (try)\n` + "```");
    embed.setColor('#ff861f');

    await fetchedMessages.first().edit(embed);*/ // get first message from map and edit it


    async createMatch() {
        async function createCategory() {
            return await this.message.guild.channels.create(`WEREWOLF MATCH: ${this.message.author.username}`, {
                type: 'category',
                permissionOverwrites: [{
                    id: this.message.guild.roles.everyone.id,
                    deny: ['VIEW_CHANNEL'],
                }]
            });
        }

        async function createChannels(matchCategory: CategoryChannel) {

            const lobbyChannel = await this.message.guild.channels.create(`🔑-lobby`, {
                type: 'text',
                parent: matchCategory.id
            });

            const movesChannel = await this.message.guild.channels.create(`🎲-moves`, {
                type: 'text',
                parent: matchCategory.id,
                permissionOverwrites: [{
                    id: this.message.guild.roles.everyone.id,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                }]
            });

            const voiceChannel = await this.message.guild.channels.create(`🎤-voice`, {
                type: 'voice',
                parent: matchCategory.id
            });

            return {lobbyChannel, movesChannel, voiceChannel};
        }


        async function sendJoinMessage(lobbyChannel: Channel) {

            const embed = new MessageEmbed();
            embed.setTitle("You're all by yourself! Find at least 7 other users to start the match");
            embed.setDescription("```css\n" + `${this.message.author.username} (MatchLeader)\n` + "```");
            embed.setColor('#ff861f');


            const joinMessage = await lobbyChannel.send(embed);
            await joinMessage.pin();
            await lobbyChannel.bulkDelete(1);
        }

        async function insertMatch(guildID: string, categoryID: string) {
            let [results]: any[] = await link.execute(`INSERT INTO matches (GUILD_ID, CATEGORY_ID) VALUES (?, ?)`, [guildID, categoryID]);
            return results[0].insertId;
        }

        const matchCategory = await createCategory();
        const matchChannels = await createChannels(matchCategory);
        await sendJoinMessage(matchChannels.lobbyChannel);
        this.id = await insertMatch(matchCategory.id, matchChannels.lobbyChannel.id);
        await this.addUser(this.message.author, true);
    }

    async getMatchByLeader() {
        let [results] = await link.execute(`SELECT USER_ID FROM matches_users WHERE MATCH_ID = ? AND LEADER = 1 LIMIT 1`, [this.id]);
    }


    async updateJoinMessage() {
        let updatedDesc = '```css\n';
        let joinCount = 0;
        let [results]: any[] = await link.execute(`SELECT GUILD_ID, VILLAGE_CHANNEL_ID, JOIN_MESSAGE_ID FROM matches WHERE MATCH_ID = ?`, [matchID]);
        const guild = await this.message.guild;
        const lobbyChannel = await client.channels.fetch(results[0].VILLAGE_CHANNEL_ID);
        const fetchedMessage = await lobbyChannel.messages.fetch(results[0].JOIN_MESSAGE_ID);


        let [leaderResults]: any[] = await link.execute(`SELECT DISCORD_USER_ID FROM users JOIN matches_users ON users.USER_ID = matches_users.USER_ID WHERE matches_users.LEADER = 1 AND matches_users.MATCH_ID = ?`, [matchID]);

        for (let i = 0; i < leaderResults.length; i++) {
            let joinedUser = await guild?.members.fetch(leaderResults[i].DISCORD_USER_ID);
            updatedDesc += joinedUser?.user.username + ' (MATCHLEADER)\n';
            joinCount++
        }

        let [userResults] = await link.execute(`SELECT DISCORD_USER_ID FROM users JOIN matches_users ON users.USER_ID = matches_users.USER_ID WHERE matches_users.LEADER = 0 AND matches_users.MATCH_ID = ?`, [matchID]);

        for (let i = 0; i < userResults.length; i++) {
            let joinedUser = await guild.members.fetch(userResults[i].DISCORD_USER_ID);
            updatedDesc += joinedUser.user.username + '\n';
            joinCount++
        }
        updatedDesc += '```';

        let embed = new MessageEmbed();

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

    async getLeader() {
        let [results]: any[] = await link.execute(`SELECT USER_ID FROM matches_users WHERE MATCH_ID = ? AND LEADER = 1 LIMIT 1`, [this.id]);

        return results[0].USER_ID;
    }


    async getState() {
        let [results]: any[] = await link.execute(`SELECT STARTED FROM matches WHERE MATCH_ID = ?`, [this.id]);

        return results[0].STARTED !== 0;
    }

    async getUsers() {
        let [results]: any[] = await link.execute(`SELECT USER_ID FROM matches_players WHERE MATCH_ID = ?`, [this.id]);
        let userList: string[] = [];

        results.forEach((result:Object) => {
            userList.push(result.USER_ID);
        });

        return userList;
    }

    async addUser(userID: User, leader = false) {
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

    async removeUser(userID: number):Promise<void> {
        const [results] = await link.execute(`SELECT * FROM games WHERE MATCH_ID = ?`, [this.id]);

        if (!results.length) {
            await this.message.reply("Match not found. ");
            return;
        }

        await link.execute(`DELETE FROM matches_users WHERE USER_ID = ? AND MATCH_ID = ?`, [user.id, this.id]);

        let matchCategory = await client.channels.fetch(results[0].CATEGORY_ID);
        matchCategory.permissionOverwrites.fetch(this.user.id)?.delete();
    }

}

export default Match;