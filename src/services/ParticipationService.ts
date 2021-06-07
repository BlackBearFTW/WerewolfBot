import Singleton from "../decorators/Singleton";
import UserRepository from "../repositories/UserRepository";
import LobbyRepository from "../repositories/LobbyRepository";
import ParticipationRepository from "../repositories/ParticipationRepository";
import {client} from "../index";
import {CategoryChannel, User} from "discord.js";
import UserData from "../data/UserData";
import ParticipationData from "../data/ParticipationData";

@Singleton
class ParticipationService {
	async addUser(user: User, inviteCode: string, lobbyLeader = false) {
		const userRepository = new UserRepository();
		const lobbyRepository = new LobbyRepository();
		const participationRepository = new ParticipationRepository();
		const lobbyData = await lobbyRepository.findByInviteCode(inviteCode);

		if (!lobbyData) return null;

		const category = await client.channels.fetch(lobbyData.category!) as CategoryChannel;

		await category.updateOverwrite(user, {
			VIEW_CHANNEL: true
		});

		const userData = new UserData();

		userData.id = user.id;

		await userRepository.create(userData);

		const participationData = new ParticipationData();

		participationData.user_id = user.id;
		participationData.lobby_id = lobbyData.id;
		participationData.leader = lobbyLeader;
		await participationRepository.create(participationData);
	}

	async removeUser(user: User, category: CategoryChannel) {
		const lobbyRepository = new LobbyRepository();
		const participationRepository = new ParticipationRepository();
		const lobbyData = await lobbyRepository.findByCategory(category);

		if (!lobbyData) return null;

		const permission = category.permissionOverwrites.get(user.id);

		await permission!.delete();

		const participationData = new ParticipationData();

		participationData.user_id = user.id;
		participationData.lobby_id = lobbyData.id;
		await participationRepository.delete(participationData);
	}

	async changeLeader(user: User, category: CategoryChannel) {
		const lobbyRepository = new LobbyRepository();
		const participationRepository = new ParticipationRepository();
		const lobbyData = await lobbyRepository.findByCategory(category);

		if (lobbyData === null) return;

		const currentLeader = await participationRepository.getLeader(lobbyData.id!);

		if (currentLeader === null) return;

		currentLeader.leader = false;

		await participationRepository.update(currentLeader);

		const newLeader = new ParticipationData();

		newLeader.lobby_id = currentLeader.lobby_id;
		newLeader.user_id = user.id;
		newLeader.leader = true;

		await participationRepository.update(currentLeader);
	}

	async isLeader(user: User, category: CategoryChannel) {
		const lobbyRepository = new LobbyRepository();
		const participationRepository = new ParticipationRepository();
		const lobbyData = await lobbyRepository.findByCategory(category);

		if (lobbyData === null) return;

		const currentLeader = await participationRepository.getLeader(lobbyData.id!);

		return user.id === currentLeader?.user_id;
	}

	/* eslint-disable */
	async isParticipant(user: User, category: CategoryChannel): Promise<any>
	async isParticipant(user: User, inviteCode: string): Promise<any>

	async isParticipant(user: User, categoryOrInviteCode: CategoryChannel | string) {
		const lobbyRepository = new LobbyRepository();
		const participationRepository = new ParticipationRepository();
		const participationData = new ParticipationData();
		let lobbyData

		if (typeof categoryOrInviteCode === "string") {
			lobbyData = await lobbyRepository.findByInviteCode(categoryOrInviteCode);
		} else {
			lobbyData = await lobbyRepository.findByCategory(categoryOrInviteCode);
		}


		if (lobbyData === null) return null;

		participationData.user_id = user.id;
		participationData.lobby_id = lobbyData.id;
		return participationRepository.inLobby(participationData);
	}

	/* eslint-enable */
}

export default ParticipationService;