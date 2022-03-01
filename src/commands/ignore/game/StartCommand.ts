/* F
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
		/!*		Try {
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
				// Return await NotificationUtil.sendErrorEmbed(message, "Some users haven't joined voice chat yet.", undefined, false);
			}

			await gameService.startGame(message, channel.parent!);
		} catch (error) {
			console.log(error);
		}*!/

		// Do necessary checks:
		// - Check if game hasn't already started.
		// - Check if lobby has enough players.
		// - Check if all users are in the designated voice channel.

		// Change lobby status from waiting to playing.
		// Block anyone from leaving / joining.
		// Startup game:
		// - Send initial message.
		// - Tell storyline in voice channel.
		// - Start game logic loop:
		// // - Say that it's night.
		// // - Get all roles and get role with current turn and check if anyone with that role is still alive.
		// // - Allow access to moves channel for that specific role.
		// // - Execute role specific logic.
		// // - Remove access to moves channel for that specific role.
		// // - Check if someone died and set their status to dead.
		// // - Check if there are any werewolves left compared to town folks, otherwise announce winner.
		// // - Check if there are any town folks left compared to werewolves, otherwise announce winner.
		// // - Say its day again and mention any events that happened that night.
		// // - Allow players to speak in voice channel and discus potential werewolves.
		// // - Allow all players to vote for someone to lynch, continue game if votes are equal somehow.
		// // - Kill voted player and reveal their role, disallow speaking and writing.
		// // - Check again if there are any werewolves / town folks left.
	}
}

export default StartCommand;
*/
