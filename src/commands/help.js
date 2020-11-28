const {Discord, client, link} = require('/index');
module.exports = {
    name: 'help',
    execute: async(message, args) => {

            const commands = client.commands;
            const embed = new Discord.MessageEmbed()
                .setColor('#ff861f')
                .setTitle("You shouldn't ask me for help!")
                .setFooter('<> = required, () = optional');


            commands.forEach(command => {

                let cmdArgs = command.arguments;

                if (cmdArgs == undefined) {
                    cmdArgs = '';
                }

                if (command.name !== 'help') {
                    embed.addField(`!w ${command.name} ${cmdArgs}`, '↳ ' + command.description);
                }
            });

            message.channel.send(embed);

    },
};