export async function getPlayer(user) {
    const [results] = await link.execute(`SELECT PLAYER_ID FROM players WHERE DISCORD_USER_ID = ?`, [user.id]);

    if (results.length > 0) {
        return results[0];
    } else {
        return false
    }


}

export async function createPlayer(user) {
    let [results] = await link.execute(`INSERT INTO players (DISCORD_USER_ID) VALUES (?) ON DUPLICATE KEY UPDATE DISCORD_USER_ID = DISCORD_USER_ID`, [user.id]);

    if (results.insertedId > 0) {
        return results.insertedId;
    }

    [results] = await link.execute(`SELECT PLAYER_ID FROM players WHERE DISCORD_USER_ID = ?`, [user.id]);
    return results[0].PLAYER_ID;
}

export async function getStats(user) {
    const [results] = await link.execute(`SELECT WIN_COUNT, LOSE_COUNT, DEATH_COUNT FROM players WHERE DISCORD_USER_ID = ?`, [user.id]);


    if (results.length > 0) {
        return results[0];
    } else {
        return false
    }
}

export function updateStat(playerID, statName, value) {

}

export async function joinGame(playerID, gameID, message, leader = false) {
    await link.execute(`INSERT INTO games_players (PLAYER_ID, GAME_ID, LEADER) VALUES (?, ?, ?)`, [playerID, gameID, leader]);

    let [results] = await link.execute(`SELECT CATEGORY_ID, VILLAGE_CHANNEL_ID FROM games WHERE GAME_ID = ?`, [gameID]);

    await client.channels.fetch(results[0].CATEGORY_ID).then(gameCategory => {
        gameCategory.createOverwrite(message.author, {
            VIEW_CHANNEL: true
        });
    });

    await client.channels.fetch(results[0].VILLAGE_CHANNEL_ID).then(lobbyChannel => {
        lobbyChannel.send(`<@${message.author.id}>`).then(quickMention => {
            quickMention.delete();
        });
    });

}

export async function leaveGame(playerID, guildID, message) {
    let [results] = await link.execute(`SELECT games.GAME_ID, games.CATEGORY_ID FROM games JOIN games_players ON games.GAME_ID = games_players.GAME_ID WHERE games_players.PLAYER_ID = ? AND games.GUILD_ID = ?`, [playerID, guildID]);

    if (!results.length) {
        return message.reply("This channel does not belong to a game");
    }

    const gameID = results[0].GAME_ID;

    await link.execute(`DELETE FROM games_players WHERE PLAYER_ID = ? AND GAME_ID = ?`, [playerID, gameID]);

    await client.channels.fetch(results[0].CATEGORY_ID).then(gameCategory => {
        gameCategory.createOverwrite(message.author, {
            VIEW_CHANNEL: false
        });
    });
}

export async function activeGameCheck(playerID, guildID) {
    let [results] = await link.execute(`SELECT games_players.GAME_ID FROM games_players JOIN games ON games.GAME_ID = games_players.GAME_ID WHERE games_players.PLAYER_ID = ? AND games.GUILD_ID = ?`, [playerID, guildID]);

    return results.length > 0;
}

export async function gameLeaderCheck(mentionID, guildID) {
    let [results] = await link.execute(`SELECT games_players.GAME_ID FROM games_players JOIN games ON games.GAME_ID = games_players.GAME_ID WHERE games_players.PLAYER_ID = ? AND games.GUILD_ID = ? AND games_players.LEADER = 1`, [mentionID, guildID]);

    if (results.length > 0) {
        return results[0].GAME_ID
    } else {
        return false;
    }

}


