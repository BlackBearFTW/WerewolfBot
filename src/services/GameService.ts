import Singleton from "../decorators/Singleton";
import {CategoryChannel, Message, MessageEmbed, TextChannel, VoiceChannel} from "discord.js";
import LobbyRepository from "../repositories/LobbyRepository";
import ParticipationRepository from "../repositories/ParticipationRepository";
import {embedColors, werewolfCount} from "../config.json";
import {client} from "../index";
import RolesEnum from "../types/RolesEnum";
import ParticipationData from "../data/ParticipationData";
import LobbyData from "../data/LobbyData";
import ManipulationUtil from "../utils/ManipulationUtil";
import RolesManager from "../managers/RolesManager";
import DateUtil from "../utils/DateUtil";

@Singleton
class GameService {
	async startGame(message: Message, category: CategoryChannel) {
		const lobbyRepository = new LobbyRepository();
		const participationRepository = new ParticipationRepository();

		const lobbyData = await lobbyRepository.findByCategory(category);

		if (lobbyData === null) return null;

		const participants = await participationRepository.getAllParticipants(lobbyData?.id!);
		const participantsID = participants.map(participant => participant.user_id!);

		lobbyData.started = true;

		const assignedParticipants = await this.assignRoles(participantsID, lobbyData);

		await lobbyRepository.update(lobbyData);
		await this.playIntro(category);
		await this.startCycle(category.children.array()[2] as TextChannel, assignedParticipants);
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
				user_id: value!,
				role_id: RolesEnum.WEREWOLF
			});
		});

		assignedParticipants.push({
			user_id: participantsID.shift()!,
			role_id: RolesEnum.FORTUNE_TELLER
		});

		participantsID.map(value => {
			assignedParticipants.push({
				user_id: value!,
				role_id: RolesEnum.TOWN_FOLK
			});
		});

		const participationRepository = new ParticipationRepository();

		assignedParticipants.map(async value => {
			const user = await client.users.fetch(value.user_id!);
			const participationData = new ParticipationData();
			const embed = new MessageEmbed();

			participationData.lobby_id = lobbyData.id!;
			participationData.user_id = value.user_id!;
			participationData.role_id = value.role_id!;

			await participationRepository.assignRole(participationData);

			const rolesManager = new RolesManager();
			const roleData = await rolesManager.getRole(value.role_id!);
			const guild = await client.guilds.fetch(lobbyData.guild!);

			const category = await client.channels.fetch(lobbyData.category!) as CategoryChannel;

			embed.setTitle(`${roleData?.getEmote()} ${roleData?.getName()}`);
			embed.setColor(embedColors.neutralColor);
			embed.setDescription(roleData?.getDescription());
			embed.setTimestamp();

			await user.send(
				`You got the ${roleData?.getName()} role for the game in lobby \`${lobbyData.invite_code}\`, which is hosted on ${guild.name}.`, {embed})
				.catch(async () => {
					const channel = category.children.array()[1] as TextChannel;

					await channel.send(`${user.toString()} Please open your direct messages.`);
				});
		});

		return assignedParticipants;
	}

	private async playIntro(category: CategoryChannel) {
		const mainChannel = category.children.array()[1] as TextChannel;
		const voiceChannel = category.children.last() as VoiceChannel;

		await voiceChannel.join();

		// Connection.play(createReadStream("./assets/audio/night.webm"), { type: "webm/opus" });

		await mainChannel.send("Intro blahblabah, its night");
	}

	private async startCycle(movesChannel: TextChannel, participants: {user_id: string, role_id: RolesEnum}[]) {
		const rolesManager = new RolesManager();
		const rolesCollection = await rolesManager.getAllRoles();
		const lobbyRepository = new LobbyRepository();
		const lobbyData = await lobbyRepository.findByCategory(movesChannel.parent!);

		rolesCollection.sort((a, b) => a.getTurnPosition()! - b.getTurnPosition()!);

		let stillGoing = true;

		while (stillGoing) {
			// TODO: mute everyone and stop send_message permission
			const voiceChannel = await movesChannel.parent?.children.last();

			voiceChannel!.members.map(member => {
				voiceChannel!.updateOverwrite(member, {
					SPEAK: false
				});
			});

			for (const role of rolesCollection.array().values()) {
				const participantsWithRole = participants.filter(item => item.role_id === role.getId());

				for (const participant of participantsWithRole) {
					await movesChannel.updateOverwrite(participant.user_id!, {
						VIEW_CHANNEL: true
					});
				}

				await role.execute(movesChannel);
				await DateUtil.sleep(5000);

				for (const participant of participantsWithRole) {
					await movesChannel.updateOverwrite(participant.user_id!, {
						VIEW_CHANNEL: false
					});
				}
			}

			// TODO: check if teams are still alive, mute channels, etc
			const participationRepository = new ParticipationRepository();
			const survivors = await participationRepository.getSurvivors(lobbyData?.id!);

			const werewolvesAreAlive = survivors.filter(survivor => survivor.role_id === RolesEnum.WEREWOLF).length > 0;
			const townFolksAreAlive = survivors.filter(survivor => survivor.role_id !== RolesEnum.WEREWOLF).length > 0;

			if (werewolvesAreAlive && !townFolksAreAlive) {
				const channel = movesChannel.parent?.children.array()[1] as TextChannel;

				await channel.send("Werewolves have won.");
				stillGoing = false;
				return;
			}

			if (townFolksAreAlive && !werewolvesAreAlive) {
				const channel = movesChannel.parent?.children.array()[1] as TextChannel;

				await channel.send("Town Folks have won.");
				stillGoing = false;
				return;
			}
		}
	}
}

export default GameService;