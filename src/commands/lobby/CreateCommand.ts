import {CommandInteraction, MessageEmbed} from "discord.js";
import {getConnection} from "typeorm";
import {Lobby} from "../../entities/LobbyEntity";
import SlashCommand from "../../types/decorators/SlashCommand";
import ICommand from "../../types/interfaces/CommandInterface";
import {User} from "../../entities/UserEntity";
import LobbyService from "../../service/LobbyService";
import {Participation} from "../../entities/ParticipationEntity";

// TODO: Make this command globally accessible, by giving invite code

@SlashCommand("create", "Create a new lobby")
class CreateCommand implements ICommand {
	async onInteraction(interaction: CommandInteraction): Promise<void> {
		const entityManager = getConnection().createEntityManager();
		const lobbyService = new LobbyService();

		let fetchedUser = await entityManager.findOne(User, interaction.user.id);

		if (!fetchedUser) {
			fetchedUser = entityManager.create(User, {
				id: interaction.user.id
			});

			await entityManager.save(fetchedUser);
		}

		const lobby = entityManager.create(Lobby);

		const [guild, category] = await lobbyService.setupDiscordStructure(interaction.user, interaction.guild!, lobby.inviteCode);

		lobby.guildId = guild.id;
		lobby.categoryId = category.id;

		const participant = new Participation();

		participant.user = fetchedUser;
		participant.leader = true;

		lobby.participations = [participant];

		await entityManager.save(lobby);

		await interaction.reply({
			ephemeral: true,
			embeds: [new MessageEmbed({
				title: "Creating lobby...",
				description: `Created a lobby with code \`${lobby.inviteCode}\`.`,
				color: "ORANGE"
			})]
		});
	}
}

export default CreateCommand;