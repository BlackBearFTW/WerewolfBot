import {Message, MessageEmbed} from "discord.js";
import {CommandInterface} from "../interfaces/CommandInterface";
import * as Role from "../classes/Role.js"

export const command: CommandInterface = {
	name: 'roles',
	execute: async (message: Message, args: string[]) => {
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