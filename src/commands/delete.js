const User = require('../classes/User');
const Global = require('../classes/Global');

module.exports = {
    name: 'delete',
    execute: async(message, args) => {

            if (await User.getUser(message.author) === false) {
                return Global.throwError(message, "Your not part of this match");
            }

            const user = await User.getUser(message.author);
            const userID = user.USER_ID;


            if (await User.activeMatchCheck(userID, message.guild.id) === false) return;

            if (await User.matchLeaderCheck(userID, message.guild.id) === false) {
                return Global.throwError(message, "You cannot delete this match, because you aren't the match leader");
            }

            const category = message.channel.parent;
            category.children.forEach((channel) => {
                channel.delete();
            });
            await category.delete();

            await link.execute(`DELETE FROM matches WHERE CATEGORY_ID = ?`, [category.id]);

    },
};