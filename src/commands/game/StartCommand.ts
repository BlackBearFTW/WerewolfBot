import { Message, TextChannel} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import ParticipationService from "../../services/ParticipationService";
import NotificationUtil from "../../utils/NotificationUtil";
/* Import LobbyService from "../../services/LobbyService";
import LobbyRepository from "../../repositories/LobbyRepository";
import {lobbySize} from "../../config.json";*/

class StartCommand extends BaseCommand {
	constructor() {
		super(
			"start",
			"Starts the game in the current lobby",
			{
				onlyLeader: true,
				onlyInLobby: true,
				selfDestruct: true
			}
		);
	}

	async execute(message: Message, args: string[]) {
		try {
			const participationService = new ParticipationService();
			// Const lobbyService = new LobbyService();
			// Const lobbyRepository = new LobbyRepository();

			const channel = message.channel as TextChannel;

			// Const lobbyData = await lobbyRepository.findByCategory(channel.parent!);

			// If (await lobbyService.hasStarted(lobbyData?.invite_code!)) {
			// 	Return await NotificationUtil.sendErrorEmbed(message, "This ritual has already begun!");
			// }
			//
			// If (!await participationService.isMinSize(lobbyData?.invite_code!)) {
			// 	Return await NotificationUtil.sendErrorEmbed(message, `You need at least ${lobbySize.min - 1} other players.`);
			// }

			if (!await participationService.allInVoiceChannel(message, channel.parent!)) {
				return await NotificationUtil.sendErrorEmbed(message, "Some users haven't joined voice chat yet.");
			}
		} catch (error) {
			console.log(error);
		}
	}
}

export default StartCommand;