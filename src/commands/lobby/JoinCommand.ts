import {CommandInteraction} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import {LobbyModel} from "../../models/LobbyModel";
import {getConnection} from "typeorm";
import {UserModel} from "../../models/UserModel";

class JoinCommand extends BaseCommand {
	constructor() {
		super({
			name: "join",
			description: "Join a lobby",
			options: [{
				name: "invite_code",
				description: "The invite code of the lobby you would like to join",
				type: "STRING",
				required: true
			}]
		});
	}

	async execute(interaction: CommandInteraction) {
		try {
			const lobbyRepository = getConnection().getRepository(LobbyModel);
			const userRepository = getConnection().getRepository(UserModel);

			const lobbyModel = await lobbyRepository.findOneOrFail({where: {
				inviteCode: interaction.options.getString("invite_code")
			}});

			if (!lobbyModel) {
				await interaction.reply({
					content: "Unknown invite code.",
					ephemeral: true
				});
			}

			const userModel = new UserModel();

			userModel.id = interaction.user.id;

			await userRepository.save(userModel);

			if (!await lobbyModel.addParticipant(userModel)) {
				return interaction.reply({
					content: "You already joined this lobby.",
					ephemeral: true
				});
			}

			await interaction.reply({
				content: "Joining lobby...",
				ephemeral: true
			});
		} catch (error) {
			console.log(error);
		}
	}
}

export default JoinCommand;