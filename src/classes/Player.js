class Player {
    static async getPlayer(user) {
        const [results] = await link.execute(`SELECT PLAYER_ID FROM players WHERE DISCORD_USER_ID = ?`, [user.id]);

        if (results.length > 0) {
            return results[0];
        } else {
            return false
        }

//
    }

    static async createPlayer(user) {
        let [results] = await link.execute(`INSERT INTO players (DISCORD_USER_ID) VALUES (?) ON DUPLICATE KEY UPDATE DISCORD_USER_ID = DISCORD_USER_ID`, [user.id]);

        if (results.insertedId > 0) {
            return results.insertedId;
        }

        [results] = await link.execute(`SELECT PLAYER_ID FROM players WHERE DISCORD_USER_ID = ?`, [user.id]);
        return results[0].PLAYER_ID;
    }

    static async getStats(user) {
        const [results] = await link.execute(`SELECT WIN_COUNT, LOSE_COUNT, DEATH_COUNT FROM players WHERE DISCORD_USER_ID = ?`, [user.id]);


        if (results.length > 0) {
            return results[0];
        } else {
            return false
        }
    }

    static updateStat(playerID, statName, value) {

    }

    static async joinMatch(playerID, matchID, message, leader = false) {
        await link.execute(`INSERT INTO matches_players (PLAYER_ID, MATCH_ID, LEADER) VALUES (?, ?, ?)`, [playerID, matchID, leader]);

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

    static async leaveMatch(playerID, guildID, message) {
        let [results] = await link.execute(`SELECT matches.MATCH_ID, matches.CATEGORY_ID FROM matches JOIN matches_players ON matches.MATCH_ID = matches_players.MATCH_ID WHERE matches_players.PLAYER_ID = ? AND matches.GUILD_ID = ?`, [playerID, guildID]);

        if (!results.length) {
            return message.reply("This channel does not belong to a match");
        }

        const matchID = results[0].MATCH_ID;

        await link.execute(`DELETE FROM matches_players WHERE PLAYER_ID = ? AND MATCH_ID = ?`, [playerID, matchID]);

        await client.channels.fetch(results[0].CATEGORY_ID).then(matchCategory => {
            matchCategory.createOverwrite(message.author, {
                VIEW_CHANNEL: false
            });
        });
    }

    static async activeMatchCheck(playerID, guildID) {
        let [results] = await link.execute(`SELECT matches_players.MATCH_ID FROM matches_players JOIN matches ON matches.MATCH_ID = matches_players.MATCH_ID WHERE matches_players.PLAYER_ID = ? AND matches.GUILD_ID = ?`, [playerID, guildID]);

        if (results.length > 0) {
            return true
        } else {
            return false
        }
    }

    static async matchLeaderCheck(mentionID, guildID) {
        let [results] = await link.execute(`SELECT matches_players.MATCH_ID FROM matches_players JOIN matches ON matches.MATCH_ID = matches_players.MATCH_ID WHERE matches_players.PLAYER_ID = ? AND matches.GUILD_ID = ? AND matches_players.LEADER = 1`, [mentionID, guildID]);

        if (results.length > 0) {
            return results[0].MATCH_ID
        } else {
            return false;
        }

    }


}

module.exports = Player;