import {CommandInteraction, GuildMember, Permissions, TextChannel} from "discord.js";
import {getConnection} from "typeorm";
import {Lobby} from "../entities/LobbyEntity";
import {Participation} from "../entities/ParticipationEntity";

class GuardUtil {
	public static async onlyInLobby(interaction: CommandInteraction, next: Function, fail: (title: string, description: string) => void): Promise<void> {
		const connection = getConnection();
		const lobbyRepository = connection.getRepository<Lobby>(Lobby);

		const count = await lobbyRepository.count({
			where: {
				// eslint-disable-next-line
				categoryId: (interaction.channel as TextChannel).parent?.id
			}
		});

		if (count > 0) return next();
		return fail("Cannot be used here", "This command can only be used in a lobby...");
	}

	public static async onlyLeader(interaction: CommandInteraction, next: Function, fail: (title: string, description: string) => void): Promise<void> {
		const member = interaction.member! as GuildMember;

		if (member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
			return next();
		}

		const connection = getConnection();
		const participationRepository = connection.getRepository<Participation>(Participation);

		const count = await participationRepository.count({
			where: {
				lobby: {
					// eslint-disable-next-line
					categoryId: (interaction.channel as TextChannel).parent?.id
				},
				leader: true,
				user: interaction.user.id
			}
		});

		if (count > 0) return next();
		return fail("Permission Denied", "This command can only by the lobby leader...");
	}
}

export default GuardUtil;