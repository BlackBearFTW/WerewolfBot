const Player = require('../classes/Player');
const Game = require('../classes/Game');
const Global = require('../classes/Global');
module.exports = {
    name: 'join',
    description: 'Join a game',
    arguments: '<@mention>',
    execute: async(message, args) => {

            const playerID = await Player.createPlayer(message.author);
            const guildID = message.guild.id;

            if (!args.length || !message.mentions.users.size) {
                return Global.throwError(message, "No mentioned gameleader: `!w join @mention`");
            }

            const mentionedUser = await Player.getPlayer(message.mentions.users.first());

            if (!mentionedUser) {
                return Global.throwError(message, "Could not find this game");
            }
            const mentionID = mentionedUser.PLAYER_ID;

            if (await Player.activeGameCheck(playerID, guildID) === true) {
                return Global.throwError(message, "Your already part of an active game");
            }

            if (await Player.gameLeaderCheck(mentionID, guildID) === false) {
                return Global.throwError(message, "Could not find this game");
            }

            const GameID = await Player.gameLeaderCheck(mentionID, guildID);

            if (await Game.statusCheck(GameID) == true) {
                return Global.throwError(message, "This game has already started");
            }

            await Player.joinGame(playerID, GameID, message);
            await Game.updateJoinMessage(message, GameID);

    },
};