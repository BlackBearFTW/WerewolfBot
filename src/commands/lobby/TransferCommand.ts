import {Message, TextChannel} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import LobbyRepository from "../../repositories/LobbyRepository";
import ErrorUtil from "../../utils/ErrorUtil";
import ParticipationService from "../../services/ParticipationService";

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
				await ErrorUtil.throwError(message, "This user isn't part of this lobby.");
			}

			await participationService.changeLeader(newLeader, channel.parent!);
		} catch (error) {
			console.log(error);
		}
	}
}

export default TransferCommand;