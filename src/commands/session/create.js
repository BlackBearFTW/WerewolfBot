import {Message} from "discord.js";
// import * as MatchManager from "../classes/MatchManager";


// module.exports = {
// 	name: 'create',
// 	execute: async (message: Message, args: string[]) => {
//
// 		const user = new User(message.author);
// 		const userID = await User.createUser(message.author);
// 		const guildID = message.guild.id;
//
// 		if (await User.activeMatchCheck(userID, guildID) === true) {
// 			return Global.throwError(message, 'You\'re already part of an active match');
// 		}
//
// 		const matchID = await MatchManager.createMatch(message);
// 		await User.joinMatch(userID, matchID, message, true);
// 	},
// };