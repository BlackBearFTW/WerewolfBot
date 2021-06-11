import {Message, MessageEmbed} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import UserRepository from "../../repositories/UserRepository";
import NotificationUtil from "../../utils/NotificationUtil";
import { embedColors } from "../../config.json";

class PingCommand extends BaseCommand {
	constructor() {
		super(
			"stats",
			"Shows the stats about a user"
		);
	}

	async execute(message: Message, args: string[]) {
		const userRepository = new UserRepository();

		const user = message.mentions.users.first() || message.author;

		const result = await userRepository.getById(user.id);

		if (result === null) {
			return NotificationUtil.sendErrorEmbed(message, "This user hasn't been found on this plane of existence.");
		}

		const embed = new MessageEmbed();

		// eslint-disable-next-line
		embed.setTitle(`${user.username} Stats`);
		embed.setColor(embedColors.neutralColor);
		embed.setDescription(`**Wins:** ${result.wins}\n**Losses:** ${result.losses}\n**Deaths:** ${result.deaths}\n**Played as Werewolf:** ${result.as_werewolf!}`);
		embed.setTimestamp();

		await message.channel.send(embed);
	}
}

export default PingCommand;