const Player = require('../classes/Player');
const Match = require('../classes/Match');
const Global = require('../classes/Global');

module.exports = {
    name: 'delete',
    execute: async(message, args) => {

            if (await Player.getPlayer(message.author) == false) {
                return Global.throwError(message, "Your not part of this match");
            }

            const player = await Player.getPlayer(message.author);
            const playerID = player.PLAYER_ID;


            if (await Player.activeMatchCheck(playerID, message.guild.id) == false) return;

            if (await Player.matchLeaderCheck(playerID, message.guild.id) == false) {
                return Global.throwError(message, "You cannot delete this match, because you aren't the match leader");
            }

            const category = message.channel.parent;
            category.children.forEach(async (channel) => await channel.delete());
            category.delete();

            let [results] = await link.execute(`DELETE FROM matches WHERE CATEGORY_ID = ?`, [category.id]);

    },
};