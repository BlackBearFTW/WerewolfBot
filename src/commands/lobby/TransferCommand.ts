import {Message, TextChannel} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import LobbyRepository from "../../repositories/LobbyRepository";
import ParticipationRepository from "../../repositories/ParticipationRepository";
import ParticipationData from "../../data/ParticipationData";
import LobbyService from "../../services/LobbyService";
import ErrorUtil from "../../utils/ErrorUtil";

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

			const kickedUser = message.mentions.users.first()!;

			console.log(kickedUser);

			const lobbyRepository = new LobbyRepository();
			const participationRepository = new ParticipationRepository();
			const participationData = new ParticipationData();
			const channel = message.channel as TextChannel;
			const lobbyService = new LobbyService();
			const lobbyData = await lobbyRepository.findByCategory(channel.parent!);

			if (lobbyData === null) return;
			console.log("Test");
			participationData.user_id = kickedUser.id;
			participationData.lobby_id = lobbyData.id;
			participationData.leader = true;

			if (!await lobbyService.userIsInLobby(kickedUser, channel.parent!)) {
				await ErrorUtil.throwError(message, "This user isn't part of this lobby.");
			}

			await participationRepository.update(participationData);

			participationData.user_id = message.author.id;
			participationData.leader = false;

			await participationRepository.update(participationData);
		} catch (error) {
			console.log(error);
		}
	}
}

export default TransferCommand;