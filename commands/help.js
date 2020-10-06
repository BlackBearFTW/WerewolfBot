module.exports = {
    name: 'help',
    execute(message, args) {
        main();

        async function main() {

            const commands = client.commands;
            const embed = new Discord.MessageEmbed()
                .setColor('#ff861f')
                .setTitle('You shouldnt ask me for help!')
                .setFooter('<> = required, () = optional');


            commands.forEach(command => {
                if (command.name !== 'help') {
                    embed.addField(`!w ${command.name} ${command.arguments}`, "Description");
                }
            });

            message.channel.send(embed);
        }
    },
};