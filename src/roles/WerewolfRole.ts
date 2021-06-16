import BaseRole from "../abstracts/BaseRole";
import RolesEnum from "../types/RolesEnum";
import {TextChannel} from "discord.js";
import NotificationUtil from "../utils/NotificationUtil";
import DateUtil from "../utils/DateUtil";
import LobbyRepository from "../repositories/LobbyRepository";
import ParticipationRepository from "../repositories/ParticipationRepository";

class WerewolfRole extends BaseRole {
	constructor() {
		super(RolesEnum.WEREWOLF, "Werewolf", "Lorem Ipsum", ":wolf:", 1);
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
			if (item.dead === true) continue;

			const guildMember = await channel.guild!.members.fetch(item.user_id!);

			participants.push(guildMember.user.username);
		}

		const pollMessage = await NotificationUtil.sendPollEmbed(
			channel.messages.cache.last()!, participants, "Pick someone you would like to brutally murder.");

		await DateUtil.sleep(30000);

		const optionsThatHaveVotes = pollMessage.reactions.cache.filter(value => value.count! > 1);

		if (optionsThatHaveVotes.size === 0) {
			await channel.send("Missed your chance, sun is rising.");
			return;
		}

		if (optionsThatHaveVotes.array()[0].count === optionsThatHaveVotes.array()[1].count) {
			await channel.send("Looks like the werewolves couldn't make up their mind and now missed their window of opportunity");
		}

		const highestPick = optionsThatHaveVotes.sort((a, b) => b.count! - a.count!).first();
		const emote = highestPick?.emoji.toString()!;

		const descriptionLines = pollMessage.embeds[0].description!.split("\n");

		const foundLine = descriptionLines.filter((line: string) => line.startsWith(emote)).join();

		await channel.send(`${foundLine} was chosen to be killed.`);
	}
}

export default WerewolfRole;