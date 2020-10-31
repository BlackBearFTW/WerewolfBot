const Player = require('../classes/Player');
const Game = require('../classes/Game');
const Global = require('../classes/Global');
module.exports = {
    name: 'create',
    execute: async(message, args) => {
            const playerID = await Player.createPlayer(message.author);
            const guildID = message.guild.id;

            if (await Player.activeGameCheck(playerID, guildID) === true) {
                return Global.throwError(message, "You're already part of an active game");
            }

            const gameID = await Game.createGame(message);
            await Player.joinGame(playerID, gameID, message, true);
    },
};