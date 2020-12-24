const User = require('../classes/User');
const Match = require('../classes/Match');
const Global = require('../classes/Global');
module.exports = {
	name: 'join',
	description: 'Join a match',
	arguments: '<@mention>',
	execute: async (message, args) => {

		const userID = await User.createUser(message.author);
		const guildID = message.guild.id;

		if (!args.length || !message.mentions.users.size) {
			return Global.throwError(message, 'No mentioned matchleader: `!w join @mention`');
		}

		const mentionedUser = await User.getUser(message.mentions.users.first());

		if (!mentionedUser) {
			return Global.throwError(message, 'Could not find this match');
		}
		const mentionID = mentionedUser.USER_ID;

		if (await User.activeMatchCheck(userID, guildID) === true) {
			return Global.throwError(message, 'Your already part of an active match');
		}

		if (await User.matchLeaderCheck(mentionID, guildID) === false) {
			return Global.throwError(message, 'Could not find this match');
		}

		const matchID = await User.matchLeaderCheck(mentionID, guildID);

		if (await Match.statusCheck(matchID) == true) {
			return Global.throwError(message, 'This match has already started');
		}

		await User.joinMatch(userID, matchID, message);
		await Match.updateJoinMessage(message, matchID);

	},
};