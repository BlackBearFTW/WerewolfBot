const {Discord, client, link} = require('/index');
class User {
    constructor(user) {
        this.user = user;
    }

    async createUser() {
        let [results] = await link.execute(`INSERT INTO users (USER_ID) VALUES (?)`, [this.user.id]);
    }

    async getStats() {
        const [results] = await link.execute(`SELECT WIN_COUNT, LOSE_COUNT, DEATH_COUNT FROM users WHERE USER_ID = ?`, [this.user.id]);


        if (results.length > 0) {
            return results[0];
        } else {
            return false
        }
    }

    async updateStat(statName, value, relative) {
        // If relative == true, value will be changed relative to the current value
    }


    async inMatch(userID, guildID) {
        let [results] = await link.execute(`SELECT matches_users.MATCH_ID FROM matches_users JOIN matches ON matches.MATCH_ID = matches_users.MATCH_ID WHERE matches_users.USER_ID = ? AND matches.GUILD_ID = ?`, [userID, guildID]);

        return results.length > 0;
    }



}

module.exports = User;