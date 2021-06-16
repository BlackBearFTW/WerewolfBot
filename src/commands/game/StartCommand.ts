import {Message, TextChannel} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import LobbyService from "../../services/LobbyService";
import LobbyRepository from "../../repositories/LobbyRepository";
import {lobbySize} from "../../config.json";
import ParticipationService from "../../services/ParticipationService";
import NotificationUtil from "../../utils/NotificationUtil";
import GameService from "../../services/GameService";

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
			const lobbyService = new LobbyService();
			const lobbyRepository = new LobbyRepository();
			const gameService = new GameService();

			const channel = message.channel as TextChannel;

			const lobbyData = await lobbyRepository.findByCategory(channel.parent!);

			if (await lobbyService.hasStarted(lobbyData?.invite_code!)) {
				return await NotificationUtil.sendErrorEmbed(message, "This ritual has already begun!");
			}

			if (!await participationService.isMinSize(lobbyData?.invite_code!)) {
				return await NotificationUtil.sendErrorEmbed(message, `You need at least ${lobbySize.min} users to start.`);
			}

			if (!await participationService.allInVoiceChannel(message, channel.parent!)) {
				return await NotificationUtil.sendErrorEmbed(message, "Some users haven't joined voice chat yet.", undefined, false);
			}

			await gameService.setupGame(message, channel.parent!);
			await gameService.startCycle();
		} catch (error) {
			console.log(error);
		}
	}
}

export default StartCommand;