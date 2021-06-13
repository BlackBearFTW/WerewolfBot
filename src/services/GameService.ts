import Singleton from "../decorators/Singleton";
import {CategoryChannel, Message} from "discord.js";
import LobbyRepository from "../repositories/LobbyRepository";
import ParticipationRepository from "../repositories/ParticipationRepository";
import { werewolfCount } from "../config.json";

@Singleton
class GameService {
	async setupGame(message: Message, category: CategoryChannel) {
		const lobbyRepository = new LobbyRepository();
		const participationRepository = new ParticipationRepository();

		const lobbyData = await lobbyRepository.findByCategory(category);

		const participants = await participationRepository.getAllParticipants(lobbyData?.id!);
		const participantsID = participants.map(participant => participant.user_id!);

		await this.assignRoles(participantsID);
	}

	private async assignRoles(participantsID: string[]) {
		const participants = ManipulationUtil.shuffle(participantsID);
		const roles: {[key: string]: string[]} = {};

		/* eslint-disable */
		const count = Object.entries(werewolfCount).flatMap(([key, value]) => {
				return participants.length >= parseInt(key) ? value : [];
			}).pop();
		/* eslint-enable */

		roles.werewolves = participantsID.splice(0, count);
		roles.seer = participantsID.splice(0, 1);
		roles.villagers = participantsID;

		return roles;
	}
}

export default GameService;