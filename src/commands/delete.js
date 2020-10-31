const Player = require('../classes/Player');
const Game = require('../classes/Game');
const Global = require('../classes/Global');
module.exports = {
    name: 'delete',
    execute(message, args) {
        main();

        async function main() {

            if (await Player.getPlayer(message.author) == false) {
                return Global.throwError(message, "Your not part of this game");
            }

            const player = await Player.getPlayer(message.author);
            const playerID = player.PLAYER_ID;


            if (await Player.activeGameCheck(playerID, message.guild.id) == false) return;

            if (await Player.gameLeaderCheck(playerID, message.guild.id) == false) {
                return Global.throwError(message, "You cannot delete this game, because you aren't the game leader");
            }

            const category = message.channel.parent;
            category.children.forEach(channel => {
                channel.delete();
            });
            category.delete();

            let [results] = await link.execute(`DELETE FROM games WHERE CATEGORY_ID = ?`, [category.id]);

        }
    },
};