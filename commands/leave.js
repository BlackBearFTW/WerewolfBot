const Player = require('../classes/Player');
const Game = require('../classes/Game');
module.exports = {
    name: 'leave',
    selfDestruct: true,
    execute(message, args) {
        main();

        async function main() {

            if (await Player.getPlayer(message.author) == false) {
                return message.reply("Your not part of this game");
            }

            const player = await Player.getPlayer(message.author);
            const playerID = player.PLAYER_ID;


            if (await Player.gameLeaderCheck(playerID, message.guild.id) != false) {
                return message.reply("You cannot leave, because you are the game leader");
            }

            const categoryID = message.channel.parent.id;

            let [results] = await link.execute(`SELECT GAME_ID FROM games WHERE CATEGORY_ID = ?`, [categoryID]);

            if (!results.length) {
                return message.reply("This channel does not belong to a game");
            }

            const gameID = results[0].GAME_ID;

            if (!playerID) {
                return message.reply("Your not part of this game");
            }

            let [deleteResults] = await link.execute(`DELETE FROM games_players WHERE PLAYER_ID = ? AND GAME_ID = ?`, [playerID, gameID]);

            const gameCategory = message.channel.parent;
            gameCategory.permissionOverwrites.get(message.author.id).delete();
            Game.updateJoinMessage(message, gameID)
        }
    },
};