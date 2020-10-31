const Player = require('../classes/Player');
const Game = require('../classes/Game');
const Global = require('../classes/Global');
module.exports = {
    name: 'leave',
    execute: async(message, args) => {

            if (await Player.getPlayer(message.author) == false) {
                return Global.throwError(message, "Your not part of this game");
            }

            const player = await Player.getPlayer(message.author);
            const playerID = player.PLAYER_ID;


            if (await Player.activeGameCheck(playerID, message.guild.id) == false) return;

            if (await Player.gameLeaderCheck(playerID, message.guild.id) != false) {
                return Global.throwError(message, "You cannot leave, because you are the game leader");
            }

            const guildID = message.guild.id;

            Player.leaveGame(playerID, guildID, message);
            // FIXME Game.updateJoinMessage(message, gameID);
    },
};