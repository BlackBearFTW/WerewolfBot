const Match = require('../classes/Match');
module.exports = {
	name: 'start',
	execute: async (message, args) => {
		await Match.getUsers();

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