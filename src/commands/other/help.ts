import {Message, MessageEmbed} from "discord.js";
import {commands} from "../../index.js";
import {CommandInterface} from "../../interfaces/CommandInterface";

export const command: CommandInterface = {
    name: 'help',
    execute: async(message: Message, args: string[]) => {

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
