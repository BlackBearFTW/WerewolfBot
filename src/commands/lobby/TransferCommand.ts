import {Message, MessageEmbed, TextChannel} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import LobbyRepository from "../../repositories/LobbyRepository";
import NotificationUtil from "../../utils/NotificationUtil";
import ParticipationService from "../../services/ParticipationService";
import {embedColors} from "../../config.json";

class TransferCommand extends BaseCommand {
	constructor() {
		super(
			"transfer",
			"Transfer leadership of lobby",
			{
				selfDestruct: true,
				onlyInLobby: true,
				onlyLeader: true
			}
		);
	}

	async execute(message: Message, args: string[]) {
		try {
			if (message.mentions.users.size === 0) return;

			const newLeader = message.mentions.users.first()!;

			const lobbyRepository = new LobbyRepository();
			const channel = message.channel as TextChannel;
			const participationService = new ParticipationService();
			const lobbyData = await lobbyRepository.findByCategory(channel.parent!);

			if (lobbyData === null) return;

			if (!await participationService.isParticipant(newLeader, channel.parent!)) {
				await NotificationUtil.sendErrorEmbed(message, "This user isn't part of this lobby.");
			}

			await NotificationUtil.sendConfirmationEmbed(message, "Are you sure you want to transfer your leadership?");

			await participationService.changeLeader(newLeader, channel.parent!);

			const embed = new MessageEmbed();

			embed.setTitle("Transferred Leadership");
			embed.setDescription(`You successfully transferred your leadership to <@${newLeader.id}>.`);
			embed.setColor(embedColors.neutralColor);

			await message.channel.send(embed);
		} catch (error) {
			console.log(error);
		}
	}
}

export default TransferCommand;