import BaseCommand from "../../abstracts/BaseCommand";
import {ColorResolvable, CommandInteraction, MessageEmbed} from "discord.js";
import {getConnection} from "typeorm";
import {UserModel} from "../../models/UserModel";
import {embedColors} from "../../config.json";

class StatsCommand extends BaseCommand {
	constructor() {
		super({
			name: "stats",
			description: "Shows stats of given user",
			options: [{
				name: "user",
				description: "the user you would like to see the stats off.",
				type: "USER",
				required: true
			}]
		});
	}

	async execute(interaction: CommandInteraction) {
		const userRepository = getConnection().getRepository(UserModel);
		const user = interaction.options.getUser("user")!;

		const userModel = await userRepository.findOneOrFail({where: {
			id: user?.id
		}});

		if (!userModel) return;

		const embed = new MessageEmbed();

		embed.setTitle(`${user.username} Stats`);
		embed.setColor(embedColors.neutralColor as ColorResolvable);
		embed.setDescription(`**Wins:** ${userModel.wins}\n**Losses:** ${userModel.losses}\n**Deaths:** ${userModel.deaths}\n**Played as Werewolf:** ${userModel.playedAsWerewolf!}`);
		embed.setTimestamp();
		embed.setThumbnail(user.avatarURL() ?? user.defaultAvatarURL);

		await interaction.reply({
			embeds: [embed],
			ephemeral: true
		});
	}
}

export default StatsCommand;