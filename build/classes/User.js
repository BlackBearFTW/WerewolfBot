"use strict";
class User {
    constructor(user) {
        this.user = user;
    }
    async createUser() {
        const [results] = await link.execute('INSERT INTO users (USER_ID) VALUES (?)', [this.user.id]);
    }
    async getStats() {
        const [results] = await link.execute('SELECT WIN_COUNT, LOSE_COUNT, DEATH_COUNT FROM users WHERE USER_ID = ?', [this.user.id]);
    }
    async createUser() {
        let [results] = await link.execute('INSERT INTO users (DISCORD_USER_ID) VALUES (?) ON DUPLICATE KEY UPDATE DISCORD_USER_ID = DISCORD_USER_ID', [user.id]);
        if (results.insertedId > 0) {
            return results.insertedId;
        }
        [results] = await link.execute('SELECT USER_ID FROM users WHERE DISCORD_USER_ID = ?', [user.id]);
        return results[0].USER_ID;
    }
    async updateStat(statName, value, relative) {
        // If relative == true, value will be changed relative to the current value
    }
    async inMatch(userID, guildID) {
        await link.execute('DELETE FROM matches_users WHERE USER_ID = ? AND MATCH_ID = ?', [userID, matchID]);
        await client.channels.fetch(results[0].CATEGORY_ID).then(matchCategory => {
            matchCategory.createOverwrite(message.author, {
                VIEW_CHANNEL: false,
            });
        });
    }
    static async matchLeaderCheck(mentionID, guildID) {
        const [results] = await link.execute('SELECT matches_users.MATCH_ID FROM matches_users JOIN matches ON matches.MATCH_ID = matches_users.MATCH_ID WHERE matches_users.USER_ID = ? AND matches.GUILD_ID = ? AND matches_users.LEADER = 1', [mentionID, guildID]);
        if (results.length > 0) {
            return results[0].MATCH_ID;
        }
        else {
            return false;
        }
    }
}
module.exports = User;
