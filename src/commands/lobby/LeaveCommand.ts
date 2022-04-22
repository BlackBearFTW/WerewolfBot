import {CommandInteraction, MessageEmbed, TextChannel} from "discord.js";
import {getConnection} from "typeorm";
import {Lobby} from "../../entities/LobbyEntity";
import SlashCommand from "../../types/decorators/SlashCommand";
// Import SlashOption from "../../types/decorators/SlashOption";
import ICommand from "../../types/interfaces/CommandInterface";
import CommandGuard from "../../types/decorators/CommandGuard";
import GuardUtil from "../../utils/GuardUtil";

// TODO: Make this command globally accessible, by giving invite code

@SlashCommand("leave", "Leave this lobby")
// @SlashOption("invite_code", "the invite code of the game", {type: "STRING"})
@CommandGuard([GuardUtil.onlyInLobby])
class LeaveCommand implements ICommand {
	async onInteraction(interaction: CommandInteraction): Promise<void> {
		const entityManager = getConnection().createEntityManager();
		const channel = interaction.channel as TextChannel;

		const lobby = await entityManager.findOne(Lobby, {
			where: {
				categoryId: channel.parent?.id
			}
		});

		if (!lobby) return interaction.deleteReply();

		if (lobby?.participations.filter(x => x.user.id === interaction.user.id).length === 0) return interaction.deleteReply();

		lobby.participations = lobby.participations.filter(val => val.user.id !== interaction.user.id);

		await entityManager.save(Lobby, lobby);

		await interaction.reply({
			ephemeral: true,
			embeds: [new MessageEmbed({
				title: "Left Lobby"
			})]
		});
	}
}

export default LeaveCommand;