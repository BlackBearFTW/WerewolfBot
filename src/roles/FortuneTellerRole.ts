import BaseRole from "../abstracts/BaseRole";
import RolesEnum from "../types/RolesEnum";
import {TextChannel} from "discord.js";
import NotificationUtil from "../utils/NotificationUtil";
import DateUtil from "../utils/DateUtil";
import LobbyRepository from "../repositories/LobbyRepository";
import ParticipationRepository from "../repositories/ParticipationRepository";
import {client} from "../index";
import RolesManager from "../managers/RolesManager";

class WerewolfRole extends BaseRole {
	constructor() {
		super(RolesEnum.FORTUNE_TELLER, "Fortune Teller", "Lorem Ipsum", ":crystal_ball:", 1);
	}

	async execute(channel: TextChannel) {
		const lobbyRepository = new LobbyRepository();
		const participationRepository = new ParticipationRepository();

		const lobbyData = await lobbyRepository.findByCategory(channel.parent!);

		const participationData = await participationRepository.getAllParticipants(lobbyData?.id!);
		const participants: string[] = [];

		for (const item of participationData) {
			// eslint-disable-next-line no-continue
			if (item.role_id === this.getId()) continue;
			// eslint-disable-next-line no-continue
			if (item.dead) continue;

			const guildMember = await channel.guild!.members.fetch(item.user_id!);

			participants.push(guildMember.user.toString());
		}

		const pollMessage = await NotificationUtil.sendPollEmbed(
			channel.messages.cache.last()!, participants, "Pick a user to see their role.");

		await DateUtil.sleep(30000);

		const optionsThatHaveVotes = pollMessage.reactions.cache.filter(value => value.count! > 1);

		if (optionsThatHaveVotes.size === 0) {
			await channel.send("Missed your chance, you hear werewolf houls.");
			return;
		}

		const highestPick = optionsThatHaveVotes.sort((a, b) => b.count! - a.count!).first();
		const emote = highestPick?.emoji.toString()!;

		const descriptionLines = pollMessage.embeds[0].description!.split("\n");

		const foundLine = descriptionLines.filter((line: string) => line.startsWith(emote)).join();

		const userID = foundLine.match(/\d+/g)?.join();

		const user = client.users.cache.get(userID!);

		const participant = await participationRepository.findById(lobbyData?.id!, userID!);
		const rolesManager = new RolesManager();

		const role = await rolesManager.getRole(participant.role_id!);

		await channel.send(`${user?.username} has the ${role?.getName()} role`);
	}
}

export default WerewolfRole;