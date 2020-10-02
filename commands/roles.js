const Role = require('../classes/Role');
module.exports = {
    name: 'roles',
    execute(message, args) {
        main();

        async function main() {

            const roles = await Role.getRoles();


            const embed = new Discord.MessageEmbed()
                .setColor('#ff861f')
                .setTitle('Role Information');

            roles.forEach(role => {
                embed.addField(role.EMOTE + " " + role.NAME, role.DESCRIPTION, true);
            });

            await message.channel.send(embed);
        }
    },
};