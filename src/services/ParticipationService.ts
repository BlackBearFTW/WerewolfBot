import Singleton from "../types/decorators/Singleton";
import UserRepository from "../repositories/UserRepository";
import LobbyRepository from "../repositories/LobbyRepository";
import ParticipationRepository from "../repositories/ParticipationRepository";
import {client} from "../index";
import {CategoryChannel, Message, TextChannel, User, VoiceChannel} from "discord.js";
import UserData from "../data/UserData";
import ParticipationData from "../data/ParticipationData";
import DiscordUtil from "../utils/DiscordUtil";

@Singleton
class ParticipationService {
	async addUser(user: User, inviteCode: string, lobbyLeader = false) {
		const userRepository = new UserRepository();
		const lobbyRepository = new LobbyRepository();
		const participationRepository = new ParticipationRepository();
		const lobbyData = await lobbyRepository.findByInviteCode(inviteCode);

		if (!lobbyData) return null;

		const category = await client.channels.fetch(lobbyData.category!) as CategoryChannel;

		await category.permissionOverwrites.set(user, {
			VIEW_CHANNEL: true
		});

		const informationChannel = category.children.first();

		await informationChannel!.updateOverwrite(user.id, {
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

		const mainChannel = category.children.array()[1] as TextChannel;

		await mainChannel.send(`${user} just joined this lobby.`);
	}

	async removeUser(user: User, category: CategoryChannel) {
		const lobbyRepository = new LobbyRepository();
		const participationRepository = new ParticipationRepository();
		const lobbyData = await lobbyRepository.findByCategory(category);

		if (!lobbyData) return null;

		const permission = category.permissionOverwrites.get(user.id);

		await permission!.delete();

		const informationChannel = category.children.first();

		const channelPermission = informationChannel!.permissionOverwrites.get(user.id);

		await channelPermission!.delete();

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

		await participationRepository.updateLeader(currentLeader);

		const newLeader = new ParticipationData();

		newLeader.lobby_id = currentLeader.lobby_id;
		newLeader.user_id = user.id;
		newLeader.leader = true;

		await participationRepository.updateLeader(newLeader);
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

	async isMaxSize(inviteCode: string) {
		const lobbyRepository = new LobbyRepository();
		const lobbyData = await lobbyRepository.findByInviteCode(inviteCode);

		if (lobbyData === null) return null;

		const participationRepository = new ParticipationRepository();
		const participationData = new ParticipationData();

		participationData.lobby_id = lobbyData.id;

		return await participationRepository.isMaxSize(participationData);
	}

	async isMinSize(inviteCode: string) {
		const lobbyRepository = new LobbyRepository();
		const lobbyData = await lobbyRepository.findByInviteCode(inviteCode);

		if (lobbyData === null) return null;

		const participationRepository = new ParticipationRepository();
		const participationData = new ParticipationData();

		participationData.lobby_id = lobbyData.id;

		return await participationRepository.isMinSize(participationData);
	}

	async allInVoiceChannel(message: Message, category: CategoryChannel) {
		const lobbyRepository = new LobbyRepository();
		const participationRepository = new ParticipationRepository();
		const lobbyData = await lobbyRepository.findByCategory(category);

		if (lobbyData === null) return null;

		const participants = await participationRepository.getAllParticipants(lobbyData.id!);
		const participantsID = participants.map(participant => participant.user_id!).sort();

		const guildMembers = await DiscordUtil.getVoiceChannelMembers(category.children.last() as VoiceChannel);
		const usersID = guildMembers.map(member => member.user.id).sort();

		return participantsID.every((value, index) => value === usersID[index]);
	}
}

export default ParticipationService;