const {Discord, client, link} = require('/index');
const User = require('../classes/User');
const Match = require('../classes/Match');
const Global = require('../classes/Global');
module.exports = {
    name: 'create',
    execute: async(message, args) => {

        let user = new User(message.author);
            const userID = await User.createUser(message.author);
            const guildID = message.guild.id;

            if (await User.activeMatchCheck(userID, guildID) === true) {
                return Global.throwError(message, "You're already part of an active match");
            }

            const matchID = await Match.createMatch(message);
            await User.joinMatch(userID, matchID, message, true);
    },
};