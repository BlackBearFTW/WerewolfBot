import {Message} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import NotificationUtil from "../../utils/NotificationUtil";
import ParticipationService from "../../services/ParticipationService";
import LobbyService from "../../services/LobbyService";
import LobbyRepository from "../../repositories/LobbyRepository";

class JoinCommand extends BaseCommand {
	constructor() {
		super(
			"join",
			"Joins an existing lobby category",
		);
	}

	async execute(message: Message, args: string[]) {
		try {
			const participationService = new ParticipationService();
			const lobbyService = new LobbyService();
			const lobbyRepository = new LobbyRepository();

			if (!args[0]) return await NotificationUtil.sendErrorEmbed(message, "Please give a valid invite code as argument.");

			if (!await lobbyRepository.findByInviteCode(args[0])) {
				return await NotificationUtil.sendErrorEmbed(message, "Unknown invite code.", undefined, false);
			}

			if (await lobbyService.hasStarted(args[0])) {
				return await NotificationUtil.sendErrorEmbed(message, "This ritual has already started, better to stay away.");
			}

			if (await participationService.isParticipant(message.author, args[0])) {
				return await NotificationUtil.sendErrorEmbed(message, "You are already part of this lobby.");
			}

			if (await participationService.isMaxSize(args[0])) {
				return await NotificationUtil.sendErrorEmbed(message, "This lobby already has the max amount of players.");
			}

			await participationService.addUser(message.author, args[0]);
		} catch (error) {
			console.log(error);
		}
	}
}

export default JoinCommand;