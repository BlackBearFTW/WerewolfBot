import {ColorResolvable, CommandInteraction, MessageEmbed} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import {LobbyModel} from "../../models/LobbyModel";
import {getConnection} from "typeorm";
import {UserModel} from "../../models/UserModel";
import {embedColors} from "../../config.json";

class CreateCommand extends BaseCommand {
	constructor() {
		super({
			name: "create",
			description: "Creates a new lobby"
		});
	}

	async execute(interaction: CommandInteraction) {
		try {
			const lobbyRepository = getConnection().getRepository(LobbyModel);
			const userRepository = getConnection().getRepository(UserModel);
			const lobbyModel = new LobbyModel();

			await lobbyModel.createDiscordStructure(interaction.guild!);
			await lobbyModel.sendInformationEmbeds();

			await lobbyRepository.save(lobbyModel);

			const userModel = new UserModel();

			userModel.id = interaction.user.id;

			await userRepository.save(userModel);

			await lobbyModel.addParticipant(userModel, true);

			const embed = new MessageEmbed();

			embed.setTitle("Lobby Created");
			embed.setDescription(`Your invite code: \`${lobbyModel.inviteCode}\``);
			embed.setColor(embedColors.neutralColor as ColorResolvable);

			await interaction.reply({
				embeds: [embed],
				ephemeral: true
			});
		} catch (error) {
			console.log(error);
		}
	}
}

export default CreateCommand;