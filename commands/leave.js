const Player = require('../classes/Player');
const Game = require('../classes/Game');
module.exports = {
    name: 'leave',
    execute(message, args) {
        main();

        async function main() {

            if (await Player.getPlayer(message.author) == false) {
                return message.reply("Your not part of this game");
            }

            const player = await Player.getPlayer(message.author);
            const playerID = player.PLAYER_ID;


            if (await Player.activeGameCheck(playerID, message.guild.id) == false) return;

            if (await Player.gameLeaderCheck(playerID, message.guild.id) != false) {
                return message.reply("You cannot leave, because you are the game leader");
            }

            const guildID = message.guild.id;

            Player.leaveGame(playerID, guildID);
            Game.updateJoinMessage(message, gameID);

        }
    },
};