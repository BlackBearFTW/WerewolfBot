import Singleton from "../decorators/Singleton";
import {CategoryChannel, Message, MessageEmbed, Role, TextChannel, VoiceChannel} from "discord.js";
import LobbyRepository from "../repositories/LobbyRepository";
import ParticipationRepository from "../repositories/ParticipationRepository";
import { werewolfCount, embedColors } from "../config.json";
import {client} from "../index";
import RoleRepository from "../repositories/RoleRepository";
import RolesEnum from "../types/RolesEnum";
import ParticipationData from "../data/ParticipationData";
import LobbyData from "../data/LobbyData";
import ManipulationUtil from "../utils/ManipulationUtil";
import {createReadStream} from "fs";

@Singleton
class GameService {
	async setupGame(message: Message, category: CategoryChannel) {
		const lobbyRepository = new LobbyRepository();
		const participationRepository = new ParticipationRepository();

		const lobbyData = await lobbyRepository.findByCategory(category);

		if (lobbyData === null) return null;

		const participants = await participationRepository.getAllParticipants(lobbyData?.id!);
		const participantsID = participants.map(participant => participant.user_id!);

		lobbyData.started = true;

		await this.assignRoles(participantsID, lobbyData);

		await lobbyRepository.update(lobbyData);
		await this.playIntro(category);
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
			role_id: RolesEnum.FORTUNE_TELLER
		});

		participantsID.map(value => {
			assignedParticipants.push({
				user_id: value,
				role_id: RolesEnum.VILLAGER
			});
		});

		const roleRepository = new RoleRepository();
		const participationRepository = new ParticipationRepository();

		assignedParticipants.map(async value => {
			const user = await client.users.fetch(value.user_id!);
			const participationData = new ParticipationData();
			const embed = new MessageEmbed();

			participationData.lobby_id = lobbyData.id!;
			participationData.user_id = value.user_id!;
			participationData.role_id = value.role_id!;

			await participationRepository.assignRole(participationData);

			const roleData = await roleRepository.getById(value.role_id!);
			const guild = await client.guilds.fetch(lobbyData.guild!);

			embed.setTitle(`${roleData.emote} ${roleData.name}`);
			embed.setColor(embedColors.neutralColor);
			embed.setDescription(roleData.description);
			embed.setTimestamp();

			await user.send(`You got the ${roleData.name} role for the game in lobby \`${lobbyData.invite_code}\`, which is hosted on ${guild.name}.`, {embed});
		});
	}

	private async playIntro(category: CategoryChannel) {
		const mainChannel = category.children.array()[1] as TextChannel;
		const voiceChannel = category.children.last() as VoiceChannel;

		const connection = await voiceChannel.join();

		connection.play(createReadStream("./assets/audio/night.webm"), { type: "webm/opus" });

		await mainChannel.send("Intro blahblabah, its night");
	}

	async startCycle() {
		const roleRepository = new RoleRepository();
		const roleData = await roleRepository.getAll();

		roleData.sort((a, b) => a.position! - b.position!);

		roleData.map(role => {

		});
	}
}

export default GameService;