import { MessageEmbed } from "discord.js";
import { commands } from "../index.js";
export const command = {
    name: 'help',
    execute: async (message, args) => {
        const embed = new MessageEmbed()
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
        await message.channel.send(embed);
    },
};
