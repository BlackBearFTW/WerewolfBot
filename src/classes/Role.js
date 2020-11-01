class Role {

    static async getRoles() {
        let [results] = await link.execute(`SELECT NAME, DESCRIPTION, EMOTE, POSITION FROM roles`);
        return results;
    }

    static async assignRoles(matchID, playerList) {

        let werewolfCount;
        let pickList;
        let disqualifiedList;
        let werewolfList = this.getWerewolves(matchID);

        if (playerList.length < 12) {
            werewolfCount = 2;
        } else if (playerList.length < 18) {
            werewolfCount = 3;
        } else {
            werewolfCount = 4;
        }

        if (werewolfList !== false) {


            // Picks one or multiple werewolves from last match to be disqualified in this match again.
            disqualifiedList = werewolfList.sort(() => 0.5 - Math.random()).slice(0, Math.random() * (werewolfList.length - 1) + 1);

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

        // Adds disqualified members back to picklist so they can possibly get another role
        pickList = pickList.concat(disqualifiedList)
        let villagerList = pickList
        // Pick other players for other roles
        const seer = pickList.splice(Math.floor(Math.random() * pickList.length), 1)[0];
        const witch = pickList.splice(Math.floor(Math.random() * pickList.length), 1)[0];
        const cupid = pickList.splice(Math.floor(Math.random() * pickList.length), 1)[0];

        for (const player of villagerList) {
            let roleID;
            if(player === seer) {
                roleID = 3;
            } else if (player === witch) {
                roleID = 4;
            } else if (player === cupid) {
                roleID = 6;
            } else {
                roleID = 2;
            }
            await link.execute(`UPDATE matches_players JOIN players ON matches_players.PLAYER_ID = players.PLAYER_ID SET matches_players.ROLE_ID = ? WHERE players.DISCORD_USER_ID = ?`, [roleID, player])
        }

    }


    static async getWerewolves(matchID) {
        let [results] = await link.execute(`SELECT players.DISCORD_USER_ID FROM players JOIN matches_players ON players.PLAYER_ID = matches_players.PLAYER_ID WHERE matches_players.ROLE_ID = 5 AND matches_players.MATCH_ID = ?`, [matchID]);
        let werewolfList = [];

        if (results.length === 0) {
            return false;
        }

        results.forEach(result => {
            werewolfList.push(result.DISCORD_USER_ID);
        })

        return werewolfList;
    }
}

module.exports = Role