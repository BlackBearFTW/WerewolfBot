const Player = require('../classes/Player');
const Game = require('../classes/Game');
const Global = require('../classes/Global');
module.exports = {
    name: 'join',
    description: 'Join a match',
    arguments: '<@mention>',
    execute: async(message, args) => {

            const playerID = await Player.createPlayer(message.author);
            const guildID = message.guild.id;

            if (!args.length || !message.mentions.users.size) {
                return Global.throwError(message, "No mentioned matchleader: `!w join @mention`");
            }

            const mentionedUser = await Player.getPlayer(message.mentions.users.first());

            if (!mentionedUser) {
                return Global.throwError(message, "Could not find this match");
            }
            const mentionID = mentionedUser.PLAYER_ID;

            if (await Player.activeMatchCheck(playerID, guildID) === true) {
                return Global.throwError(message, "Your already part of an active match");
            }

            if (await Player.matchLeaderCheck(mentionID, guildID) === false) {
                return Global.throwError(message, "Could not find this match");
            }

            const matchID = await Player.matchLeaderCheck(mentionID, guildID);

            if (await Game.statusCheck(matchID) == true) {
                return Global.throwError(message, "This match has already started");
            }

            await Player.joinMatch(playerID, matchID, message);
            await Game.updateJoinMessage(message, matchID);

    },
};