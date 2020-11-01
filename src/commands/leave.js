const Player = require('../classes/Player');
const Match = require('../classes/Match');
const Global = require('../classes/Global');

module.exports = {
    name: 'leave',
    execute: async(message, args) => {

            if (await Player.getPlayer(message.author) == false) {
                return Global.throwError(message, "Your not part of this match");
            }

            const player = await Player.getPlayer(message.author);
            const playerID = player.PLAYER_ID;


            if (await Player.activeMatchCheck(playerID, message.guild.id) == false) return;

            if (await Player.matchLeaderCheck(playerID, message.guild.id) != false) {
                return Global.throwError(message, "You cannot leave, because you are the match leader");
            }

            const guildID = message.guild.id;

            await Player.leaveMatch(playerID, guildID, message);
            // FIXME Match.updateJoinMessage(message, matchID);
    },
};