const Player = require('../classes/Player');
const Game = require('../classes/Game');
module.exports = {
    name: 'join',
    selfDestruct: true,
    execute(message, args) {
        main();

        async function main() {
            const playerID = await Player.createPlayer(message.author);
            const guildID = message.guild.id;

            if (!args.length || !message.mentions.users.size) {
                return message.reply("No mentioned gameleader: `!w join @mention`");
            }

            const mentionedUser = await Player.getPlayer(message.mentions.users.first());

            if (!mentionedUser) {
                return message.reply(`Could not find this game`)
            }
            const mentionID = mentionedUser.PLAYER_ID;

            if (await Player.activeGameCheck(playerID, guildID) === true) {
                return message.reply(`Your already part of an active game`);
            }

            if (await Player.gameLeaderCheck(mentionID, guildID) === false) {
                return message.reply(`Could not find this game`);
            }

            const GameID = await Player.gameLeaderCheck(mentionID, guildID);
            await Player.joinGame(playerID, GameID, message);
            await Game.updateJoinMessage(message, GameID);
        }

    },
};