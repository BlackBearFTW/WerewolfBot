import BaseRole from "../abstracts/BaseRole";
import RolesEnum from "../types/RolesEnum";
import {TextChannel, VoiceChannel} from "discord.js";
import NotificationUtil from "../utils/NotificationUtil";
import DateUtil from "../utils/DateUtil";
import LobbyRepository from "../repositories/LobbyRepository";
import ParticipationRepository from "../repositories/ParticipationRepository";
import {client} from "../index";
import ParticipationData from "../data/ParticipationData";
import DiscordUtil from "../utils/DiscordUtil";

class TownFolkRole extends BaseRole {
	constructor() {
		super(RolesEnum.TOWN_FOLK,
			"Town Folk",
			`These folks have no abilities other than their own intuition.
	
			Each Ordinary Towns folk must analyze the players' behavior to guess who is a Werewolf, and try not to be falsely mistaken for a Werewolf and unduly lynched, hanged and burned.`,
			":house:",
			3);
	}

	async execute(channel: TextChannel) {
		const lobbyRepository = new LobbyRepository();
		const participationRepository = new ParticipationRepository();

		const category = channel.parent!;
		const mainChannel = category.children.array()[1] as TextChannel;

		await mainChannel.send("Its finally morning, after a good night of sleep you wake up to a loud scream. Someone was murdered again.");

		const lobbyData = await lobbyRepository.findByCategory(category);

		const participationData = await participationRepository.getAllParticipants(lobbyData?.id!);
		const participants: string[] = [];

		for (const item of participationData) {
			// eslint-disable-next-line no-continue
			if (item.dead) continue;

			const guildMember = await channel.guild?.members.fetch(item.user_id!);

			participants.push(guildMember.user.toString());
		}

		const currentParticipants = participationData.flatMap(user => {
			if (user.dead) return [];
			return user.user_id!;
		});

		await channel.send(`<@${currentParticipants.join("> <@")}>`);

		const voiceChannel = channel.parent?.children.last() as VoiceChannel;

		await DiscordUtil.muteVoiceChannel(voiceChannel, false);

		const pollMessage = await NotificationUtil.sendPollEmbed(
			channel, participants, "Pick the person you suspect of being a werewolf.");

		await DateUtil.sleep(30000);

		const optionsThatHaveVotes = pollMessage.reactions.cache.filter(value => value.count! > 1);

		if (optionsThatHaveVotes.size === 0) {
			await channel.send("There was so much debate, but none of the town folks could decide who to lynch.");
			return;
		}

		if (optionsThatHaveVotes.size > 1 && optionsThatHaveVotes.array()[0].count === optionsThatHaveVotes.array()[1].count) {
			await channel.send("Looks like the town folks couldn't make up their mind, now its evening again, everyone goes back to bed.");
		}

		const highestPick = optionsThatHaveVotes.sort((a, b) => b.count! - a.count!).first();
		const emote = highestPick?.emoji.toString()!;

		const descriptionLines = pollMessage.embeds[0].description!.split("\n");

		const foundLine = descriptionLines.filter((line: string) => line.startsWith(emote)).join();

		const userID = foundLine.match(/\d+/g)?.join();

		const user = client.users.cache.get(userID!);

		await channel.send(`${user?.username} was chosen to be lynched.`);

		const participant = new ParticipationData();

		participant.lobby_id = lobbyData?.id!;
		participant.user_id = userID!;
		participant.dead = true;

		await participationRepository.killParticipant(participant);
	}
}

export default TownFolkRole;