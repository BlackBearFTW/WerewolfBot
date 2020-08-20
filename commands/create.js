const Player = require('../classes/Player');
const Game = require('../classes/Game');
module.exports = {
    name: 'create',
    selfDestruct: true,
    execute(message, args) {
        main();

        async function main() {
            const playerID = await Player.createPlayer(message.author);
            const guildID = message.guild.id;

            if (await Player.activeGameCheck(playerID, guildID) === true) {
                return message.reply(`Your already part of an active game`);
            }

            const gameID = await Game.createGame(message);
            await Player.joinGame(playerID, gameID, message, true);
        }
    },
};