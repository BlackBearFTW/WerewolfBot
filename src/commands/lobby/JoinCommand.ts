import {CommandInteraction, MessageEmbed} from "discord.js";
import {getConnection} from "typeorm";
import {Lobby} from "../../entities/LobbyEntity";
import {User} from "../../entities/UserEntity";
import {Participation} from "../../entities/ParticipationEntity";
import SlashCommand from "../../types/decorators/SlashCommand";
import SlashOption from "../../types/decorators/SlashOption";
import ICommand from "../../types/interfaces/CommandInterface";

@SlashCommand("join", "Join an existing lobby")
@SlashOption("invite_code", "the invite code of the game", {required: true, type: "STRING"})
class JoinCommand implements ICommand {
	async onInteraction(interaction: CommandInteraction): Promise<void> {
		const entityManager = getConnection().createEntityManager();
		const inviteCode = interaction.options.getString("invite_code", true);

		const lobby = await entityManager.findOne(Lobby, {
			where: {
				inviteCode,
				guildId: interaction.guildId
			}
		});

		if (!lobby) {
			return interaction.reply({
				ephemeral: true,
				embeds: [new MessageEmbed({
					title: "Unable to find lobby",
					description: "Check if the invite code is correct and try again.",
					color: "RED"
				})]
			});
		}

		if (!lobby.participations) lobby.participations = [];

		if (lobby.participations.filter(x => x.user.id === interaction.user.id).length > 0) return interaction.deleteReply();

		let fetchedUser = await entityManager.findOne(User, interaction.user.id);

		if (!fetchedUser) {
			fetchedUser = entityManager.create(User, {
				id: interaction.user.id
			});

			await entityManager.save(fetchedUser);
		}

		lobby.participations.push(entityManager.create(Participation, {
			user: fetchedUser
		}));

		await entityManager.save(lobby);

		await interaction.reply({
			ephemeral: true,
			embeds: [new MessageEmbed({
				title: "Joined Lobby"
			})]
		});
	}
}

export default JoinCommand;