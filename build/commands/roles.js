import { MessageEmbed } from "discord.js";
import * as Role from "../classes/Role.js";
export const command = {
    name: 'roles',
    execute: async (message, args) => {
        const roles = await Role.getRoles();
        console.log(roles);
        const embed = new MessageEmbed()
            .setColor('#ff861f')
            .setTitle('Role Information');
        roles.forEach(role => {
            embed.addField(role.EMOTE + ' ' + role.NAME, role.DESCRIPTION, true);
        });
        await message.channel.send(embed);
    },
};
