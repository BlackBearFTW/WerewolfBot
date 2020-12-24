class Role {

	static async getRoles() {
		const [results] = await link.execute('SELECT NAME, DESCRIPTION, EMOTE, POSITION FROM roles');
		return results;
	}

	static async assignRoles(matchID, userList) {

		let werewolfCount;
		let pickList;
		let disqualifiedList;
		let werewolfList = this.getWerewolves(matchID);

		if (userList.length < 12) {
			werewolfCount = 2;
		}
		else if (userList.length < 18) {
			werewolfCount = 3;
		}
		else {
			werewolfCount = 4;
		}

		if (werewolfList !== false) {


			// Picks one or multiple werewolves from last match to be disqualified in this match again.
			disqualifiedList = werewolfList.sort(() => 0.5 - Math.random()).slice(0, Math.random() * (werewolfList.length - 1) + 1);

			// Removes disqualified users from pickList
			pickList = userList.filter(function(element) {
				return disqualifiedList.indexOf(element) === -1;
			});
		}
		else {
			pickList = userList;
		}

		// Pick werewolf' and removes them from pickList
		werewolfList = pickList.sort(() => 0.5 - Math.random()).slice(0, werewolfCount);
		pickList = pickList.filter(function(element) {
			return werewolfList.indexOf(element) === -1;
		});

		// Adds disqualified members back to picklist so they can possibly get another role
		pickList = pickList.concat(disqualifiedList);
		const villagerList = pickList;
		// Pick other users for other roles
		const seer = pickList.splice(Math.floor(Math.random() * pickList.length), 1)[0];
		const witch = pickList.splice(Math.floor(Math.random() * pickList.length), 1)[0];
		const cupid = pickList.splice(Math.floor(Math.random() * pickList.length), 1)[0];

		for (const user of villagerList) {
			let roleID;
			if(user === seer) {
				roleID = 3;
			}
			else if (user === witch) {
				roleID = 4;
			}
			else if (user === cupid) {
				roleID = 6;
			}
			else {
				roleID = 2;
			}
			await link.execute('UPDATE matches_users JOIN users ON matches_users.USER_ID = users.USER_ID SET matches_users.ROLE_ID = ? WHERE users.DISCORD_USER_ID = ?', [roleID, user]);
		}

	}


	static async getWerewolves(matchID) {
		const [results] = await link.execute('SELECT users.DISCORD_USER_ID FROM users JOIN matches_users ON users.USER_ID = matches_users.USER_ID WHERE matches_users.ROLE_ID = 5 AND matches_users.MATCH_ID = ?', [matchID]);
		const werewolfList = [];

		if (results.length === 0) {
			return false;
		}

		results.forEach(result => {
			werewolfList.push(result.DISCORD_USER_ID);
		});

		return werewolfList;
	}
}

module.exports = Role;