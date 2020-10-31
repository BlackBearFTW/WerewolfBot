const Player = require('../classes/Player');
const Game = require('../classes/Game');
module.exports = {
    name: 'stats',
    description: 'Look at your stats',
    arguments: '(@mention)',
    execute: async(message, args) => {

            const user = args.length > 0 ? message.mentions.users.first() : message.author;
            const userStats = await Player.getStats(user);

            const embed = new Discord.MessageEmbed()
                .setColor('#ff861f');

            if (!userStats) {
                embed.setTitle("Unknown Player!").setDescription("Seems like im not the only unknown entity around here.....");
            } else {
                embed.setTitle(user.username + "'s Stats")
                    .addField("Total Games Played", userStats.WIN_COUNT + userStats.LOSE_COUNT)
                    .addField("Games Won", userStats.WIN_COUNT)
                    .addField("Games Lost", userStats.LOSE_COUNT)
                    .addField("Death Count", userStats.DEATH_COUNT)
                    .setTimestamp()
                    .setFooter('Werewolf Master Bot', client.user.displayAvatarURL());
            }

            await message.channel.send(embed);
            
    },
};