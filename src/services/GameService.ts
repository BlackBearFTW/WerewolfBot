import Singleton from "../decorators/Singleton";
import {CategoryChannel, Message, MessageEmbed} from "discord.js";
import LobbyRepository from "../repositories/LobbyRepository";
import ParticipationRepository from "../repositories/ParticipationRepository";
import { werewolfCount, embedColors } from "../config.json";
import {client} from "../index";
import RoleRepository from "../repositories/RoleRepository";
import RolesEnum from "../types/RolesEnum";
import ParticipationData from "../data/ParticipationData";
import LobbyData from "../data/LobbyData";

@Singleton
class GameService {
	async setupGame(message: Message, category: CategoryChannel) {
		const lobbyRepository = new LobbyRepository();
		const participationRepository = new ParticipationRepository();

		const lobbyData = await lobbyRepository.findByCategory(category);

		if (lobbyData === null) return null;

		const participants = await participationRepository.getAllParticipants(lobbyData?.id!);
		const participantsID = participants.map(participant => participant.user_id!);

		await this.assignRoles(participantsID, lobbyData);
	}

	private assignRoles(participantsID: string[], lobbyData: LobbyData) {
		const shuffledParticipants = ManipulationUtil.shuffle(participantsID);

		/* eslint-disable */
		const amountOfWerewolves = Object.entries(werewolfCount).flatMap(([key, value]) => {
				return shuffledParticipants.length >= parseInt(key) ? value : [];
			}).pop();
		/* eslint-enable */

		const assignedParticipants = [];

		participantsID.splice(0, amountOfWerewolves).map(value => {
			assignedParticipants.push({
				user_id: value,
				role_id: RolesEnum.WEREWOLF
			});
		});

		assignedParticipants.push({
			user_id: participantsID.shift(),
			role_id: RolesEnum.SEER
		});

		participantsID.map(value => {
			assignedParticipants.push({
				user_id: value,
				role_id: RolesEnum.VILLAGER
			});
		});

		const roleRepository = new RoleRepository();
		const participationRepository = new ParticipationRepository();

		assignedParticipants.map(async (value, index) => {
			const user = await client.users.fetch(value.user_id!);
			const participationData = new ParticipationData();

			participationData.lobby_id = lobbyData.id!;
			participationData.user_id = value.user_id!;
			participationData.role_id = value.role_id!;

			await participationRepository.assignRole(participationData);

			const roleData = await roleRepository.getById(value.role_id!);
			const embed = new MessageEmbed();

			embed.setTitle(`${roleData.emote} ${roleData.name}`);
			embed.setColor(embedColors.neutralColor);
			embed.setDescription(roleData.description);

			await user.send(`You got the ${roleData.name} role for the game in lobby \`${lobbyData.invite_code}\`.`, {embed});
		});
	}
}

export default GameService;