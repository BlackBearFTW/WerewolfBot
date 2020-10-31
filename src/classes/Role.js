export async function getRoles() {
    let [results] = await link.execute(`SELECT NAME, DESCRIPTION, EMOTE, POSITION FROM roles`);
    return results;
}

export async function assignRoles(gameID, playerList) {

    let werewolfCount;
    let pickList;
    let werewolfList = this.getWerewolfs(gameID);

    if (playerList.length < 12) {
        werewolfCount = 2;
    } else if (playerList.length < 18) {
        werewolfCount = 3;
    } else {
        werewolfCount = 4;
    }

    if (werewolfList != false) {

        // THIS CODE ONLY RUNS WHEN THERE WAS A PREVIOUS ROUND

        // Picks one or multiple werewolfs from lastgame to be disqualified in this game again.
        let disqualifiedList = werewolfList.sort(() => 0.5 - Math.random()).slice(0, Math.random() * (enemyList.length - 1) + 1);

        // Removes disqualified players from pickList
        pickList = playerList.filter(function (element) {
            return disqualifiedList.indexOf(element) === -1;
        });
    } else {
        pickList = playerList;
    }

    // Pick werewolf' and removes them from pickList
    werewolfList = pickList.sort(() => 0.5 - Math.random()).slice(0, werewolfCount);
    pickList = pickList.filter(function (element) {
        return werewolfList.indexOf(element) === -1;
    });

    // Pick other players for other roles


}

export async function getWerewolfs(gameID) {
    let [results] = await link.execute(`SELECT players.DISCORD_USER_ID FROM players JOIN games_players ON players.PLAYER_ID = games_players.PLAYER_ID WHERE games_players.ROLE_ID = 5 AND games_players.GAME_ID = ?`, [gameID]);
    let werewolfList = [];

    if (results.length == 0) {
        return false;
    }

    results.forEach(result => {
        werewolfList.push(result.DISCORD_USER_ID);
    })

    return werewolfList;
}
