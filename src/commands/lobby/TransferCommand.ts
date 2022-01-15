import BaseCommand from "../../abstracts/BaseCommand";
import {ColorResolvable, CommandInteraction, MessageEmbed, TextChannel} from "discord.js";
import {getConnection} from "typeorm";
import {UserModel} from "../../models/UserModel";
import {embedColors} from "../../config.json";
import {ParticipationModel} from "../../models/ParticipationModel";

class TransferCommand extends BaseCommand {
	constructor() {
		super({
			name: "transfer",
			description: "Transfer leadership to another participant",
			options: [{
				name: "user",
				description: "the user you would like to transfer ownership to.",
				type: "USER",
				required: true
			}]
		});
	}

	async execute(interaction: CommandInteraction) {
		const participationRepository = getConnection().getRepository(ParticipationModel);
		const user = interaction.options.getUser("user")!;

		const channel = interaction.channel as TextChannel;

		const participationModel = await participationRepository.findOneOrFail({where: {
			lobby: { guildId: interaction.guildId, categoryId: channel.parent?.id}
		}});

		if (!participationModel) return;

		const embed = new MessageEmbed();

		await interaction.reply({
			embeds: [embed],
			ephemeral: true
		});
	}
}

export default TransferCommand;