import Singleton from "../decorators/Singleton";
import {CategoryChannel, Message} from "discord.js";
import LobbyRepository from "../repositories/LobbyRepository";
import ParticipationRepository from "../repositories/ParticipationRepository";
import { werewolfCount } from "../config.json";
import AssignedRolesInterface from "../interfaces/AssignedRolesInterface";
import {client} from "../index";

@Singleton
class GameService {
	async setupGame(message: Message, category: CategoryChannel) {
		const lobbyRepository = new LobbyRepository();
		const participationRepository = new ParticipationRepository();

		const lobbyData = await lobbyRepository.findByCategory(category);

		if (lobbyData === null) return null;

		const participants = await participationRepository.getAllParticipants(lobbyData?.id!);
		const participantsID = participants.map(participant => participant.user_id!);

		const roles = await this.assignRoles(participantsID);

		this.directMessageRoles(roles);
	}

	private assignRoles(participantsID: string[]): AssignedRolesInterface {
		const participants = ManipulationUtil.shuffle(participantsID);

		/* eslint-disable */
		const count = Object.entries(werewolfCount).flatMap(([key, value]) => {
				return participants.length >= parseInt(key) ? value : [];
			}).pop();
		/* eslint-enable */

		return {
			werewolf: participantsID.splice(0, count),
			seer: participantsID.splice(0, 1),
			villager: participantsID
		};
	}

	directMessageRoles(roles: AssignedRolesInterface) {
		Object.entries(roles).forEach(([key, value]) => {
			value.map(async (id: string) => {
				const user = await client.users.fetch(id);

				await user.send(`You are a ${key}`);
			});
		});
	}
}

export default GameService;