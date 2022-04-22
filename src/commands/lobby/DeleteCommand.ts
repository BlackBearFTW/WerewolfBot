import {CommandInteraction, TextChannel} from "discord.js";
import {getConnection} from "typeorm";
import {Lobby} from "../../entities/LobbyEntity";
import SlashCommand from "../../types/decorators/SlashCommand";
import ICommand from "../../types/interfaces/CommandInterface";
import LobbyService from "../../service/LobbyService";
import GuardUtil from "../../utils/GuardUtil";
import CommandGuard from "../../types/decorators/CommandGuard";
import guardUtil from "../../utils/GuardUtil";

@SlashCommand("delete", "Deletes the current lobby")
@CommandGuard([GuardUtil.onlyInLobby, guardUtil.onlyLeader])
class DeleteCommand implements ICommand {
	async onInteraction(interaction: CommandInteraction): Promise<void> {
		const entityManager = getConnection().createEntityManager();
		const lobbyService = new LobbyService();
		const channel = interaction.channel as TextChannel;

		const lobby = await entityManager.findOne(Lobby, {
			where: {
				// eslint-disable-next-line
				categoryId: channel.parent?.id,
				guildId: interaction.guildId!
			}
		});

		await lobbyService.deleteDiscordStructure(channel.parent!);

		await entityManager.delete<Lobby>(Lobby, lobby);

		await interaction.deleteReply();
	}
}

export default DeleteCommand;