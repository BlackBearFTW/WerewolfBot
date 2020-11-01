const Player = require('../classes/Player');
const Game = require('../classes/Game');
const Global = require('../classes/Global');
module.exports = {
    name: 'create',
    execute: async(message, args) => {
            const playerID = await Player.createPlayer(message.author);
            const guildID = message.guild.id;

            if (await Player.activeMatchCheck(playerID, guildID) === true) {
                return Global.throwError(message, "You're already part of an active match");
            }

            const matchID = await Game.createMatch(message);
            await Player.joinMatch(playerID, matchID, message, true);
    },
};