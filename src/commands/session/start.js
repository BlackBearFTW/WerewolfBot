const Match = require('../../classes/MatchManager');
module.exports = {
	name: 'start',
	execute: async (message, args) => {
		await MatchManager.getUsers();

		/* TODO
             * Update match "STARTED" to 1
             *
             *
             *
             *
             *
             */
	},
};