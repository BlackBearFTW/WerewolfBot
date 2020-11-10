"use strict";
class User {
    constructor(user) {
        this.user = user;
    }
    async createUser() {
        let [results] = await link.execute(`INSERT INTO users (DISCORD_USER_ID) VALUES (?) ON DUPLICATE KEY UPDATE DISCORD_USER_ID = DISCORD_USER_ID`, [user.id]);
        if (results.insertedId > 0) {
            return results.insertedId;
        }
        [results] = await link.execute(`SELECT USER_ID FROM users WHERE DISCORD_USER_ID = ?`, [user.id]);
        return results[0].USER_ID;
    }
    static async getStats(user) {
        const [results] = await link.execute(`SELECT WIN_COUNT, LOSE_COUNT, DEATH_COUNT FROM users WHERE DISCORD_USER_ID = ?`, [user.id]);
        if (results.length > 0) {
            return results[0];
        }
        else {
            return false;
        }
    }
    static updateStat(userID, statName, value) {
    }
    static async joinMatch(userID, matchID, message, leader = false) {
        await link.execute(`INSERT INTO matches_users (USER_ID, MATCH_ID, LEADER) VALUES (?, ?, ?)`, [userID, matchID, leader]);
        let [results] = await link.execute(`SELECT CATEGORY_ID, VILLAGE_CHANNEL_ID FROM matches WHERE MATCH_ID = ?`, [matchID]);
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
    static async leaveMatch(userID, guildID, message) {
        let [results] = await link.execute(`SELECT matches.MATCH_ID, matches.CATEGORY_ID FROM matches JOIN matches_users ON matches.MATCH_ID = matches_users.MATCH_ID WHERE matches_users.USER_ID = ? AND matches.GUILD_ID = ?`, [userID, guildID]);
        if (!results.length) {
            return message.reply("This channel does not belong to a match");
        }
        const matchID = results[0].MATCH_ID;
        await link.execute(`DELETE FROM matches_users WHERE USER_ID = ? AND MATCH_ID = ?`, [userID, matchID]);
        await client.channels.fetch(results[0].CATEGORY_ID).then(matchCategory => {
            matchCategory.createOverwrite(message.author, {
                VIEW_CHANNEL: false
            });
        });
    }
    static async activeMatchCheck(userID, guildID) {
        let [results] = await link.execute(`SELECT matches_users.MATCH_ID FROM matches_users JOIN matches ON matches.MATCH_ID = matches_users.MATCH_ID WHERE matches_users.USER_ID = ? AND matches.GUILD_ID = ?`, [userID, guildID]);
        if (results.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    static async matchLeaderCheck(mentionID, guildID) {
        let [results] = await link.execute(`SELECT matches_users.MATCH_ID FROM matches_users JOIN matches ON matches.MATCH_ID = matches_users.MATCH_ID WHERE matches_users.USER_ID = ? AND matches.GUILD_ID = ? AND matches_users.LEADER = 1`, [mentionID, guildID]);
        if (results.length > 0) {
            return results[0].MATCH_ID;
        }
        else {
            return false;
        }
    }
}
module.exports = User;
