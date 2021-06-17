import BaseRole from "../abstracts/BaseRole";
import RolesEnum from "../types/RolesEnum";
import {TextChannel} from "discord.js";
import NotificationUtil from "../utils/NotificationUtil";
import DateUtil from "../utils/DateUtil";
import LobbyRepository from "../repositories/LobbyRepository";
import ParticipationRepository from "../repositories/ParticipationRepository";
import {client} from "../index";
import ParticipationData from "../data/ParticipationData";

class WerewolfRole extends BaseRole {
	constructor() {
		super(RolesEnum.WEREWOLF,
			"Werewolf",
			`
			Each night, the Werewolves bite, kill and devour one Townsperson. 
			During the day they try to conceal their identity and vile deeds from the Townsfolk. 
			Depending upon the number of players and variants used in the game, there are 1, 2, 3 or 4 Werewolves in play.`,
			":wolf:",
			2
		);
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

		const currentParticipants = participationData.flatMap(user => {
			if (user.role_id !== this.getId()) return [];
			return user.user_id;
		});

		await channel.send(`<@${currentParticipants.join("> <@")}>`);

		const pollMessage = await NotificationUtil.sendPollEmbed(
			channel, participants, "Pick someone you would like to brutally murder.");

		await DateUtil.sleep(30000);

		const optionsThatHaveVotes = pollMessage.reactions.cache.filter(value => value.count! > 1);

		if (optionsThatHaveVotes.size === 0) {
			await channel.send("Missed your chance, sun is rising.");
			return;
		}

		if (optionsThatHaveVotes.size > 1 && optionsThatHaveVotes.array()[0].count === optionsThatHaveVotes.array()[1].count) {
			await channel.send("Looks like the werewolves couldn't make up their mind and now missed their window of opportunity");
		}

		const highestPick = optionsThatHaveVotes.sort((a, b) => b.count! - a.count!).first();
		const emote = highestPick?.emoji.toString()!;

		const descriptionLines = pollMessage.embeds[0].description!.split("\n");

		const foundLine = descriptionLines.filter((line: string) => line.startsWith(emote)).join();

		const userID = foundLine.match(/\d+/g)?.join();

		const user = client.users.cache.get(userID!);

		await channel.send(`${user?.username} was chosen to be killed.`);

		const participant = new ParticipationData();

		participant.lobby_id = lobbyData?.id!;
		participant.user_id = userID!;
		participant.dead = true;

		await participationRepository.killParticipant(participant);
	}
}

export default WerewolfRole;