const User = require('../classes/User');
const Match = require('../classes/Match');
const Global = require('../classes/Global');

module.exports = {
    name: 'leave',
    execute: async(message, args) => {

            if (await User.getUser(message.author) == false) {
                return Global.throwError(message, "Your not part of this match");
            }

            const user = await User.getUser(message.author);
            const userID = user.USER_ID;


            if (await User.activeMatchCheck(userID, message.guild.id) == false) return;

            if (await User.matchLeaderCheck(userID, message.guild.id) != false) {
                return Global.throwError(message, "You cannot leave, because you are the match leader");
            }

            const guildID = message.guild.id;

            await User.leaveMatch(userID, guildID, message);
            // FIXME Match.updateJoinMessage(message, matchID);
    },
};