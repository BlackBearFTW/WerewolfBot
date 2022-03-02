/*
Import BaseRole from "../abstracts/BaseRole";
import RolesEnum from "../types/enums/RolesEnum";
import {TextChannel} from "discord.js";
import NotificationUtil from "../utils/NotificationUtil";
import LobbyRepository from "../repositories/LobbyRepository";
import ParticipationRepository from "../repositories/ParticipationRepository";
import {client} from "../index";
import ParticipationData from "../data/ParticipationData";

class WerewolfRole extends BaseRole {
	constructor() {
		super(RolesEnum.WEREWOLF,
			"Werewolf",
			"Each night, the Werewolves bite, kill and devour one Townsperson. During the day they try to conceal their identity and vile deeds from the Townsfolk. Depending upon the number of players and variants used in the game, there are 1, 2, 3 or 4 Werewolves in play.",
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

		const [pollMessage, optionsThatHaveVotes] = await NotificationUtil.sendPollEmbed(
			channel, participants, "Pick someone you would like to brutally murder.");

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

export default WerewolfRole;*/

import IRole from "../types/interfaces/RoleInterface";
import IRoleInfo from "../types/interfaces/RoleInformationInterface";
import RolesEnum from "../types/enums/RolesEnum";
import {ParticipationModel} from "../models/ParticipationModel";
import MessagePoll from "../abstracts/MessagePoll";
import {LobbyModel} from "../models/LobbyModel";
import DiscordUtil from "../utils/DiscordUtil";
import {CategoryChannel, TextChannel} from "discord.js";
import {EntityManager} from "typeorm";

class WerewolfRole implements IRole {
	private poll?: MessagePoll;
	private lobbyModel: LobbyModel | undefined;

	public constructor(private context: EntityManager, lobbyId: string) {
		this.getLobbyData(lobbyId);
	}

	private async getLobbyData(lobbyId: string) {
		if (await this.context.findOne(LobbyModel, lobbyId)) return;
	}

	public async startTurn(): Promise<void> {
		const client = DiscordUtil.getClient();
		const nonWerewolves: ParticipationModel[] = this.lobbyModel!.participations
			.filter((i: ParticipationModel) => i.roleId === null || i.roleId === RolesEnum.WEREWOLF);

		this.poll = new MessagePoll(
			"Pick user", "",
			nonWerewolves.map(participation => client.users.cache.get(participation.user.id)!.username));

		const category = client.channels.cache.get(this.lobbyModel!.categoryId) as CategoryChannel;

		const channels = [...category.children.values()];

		this.poll.send(channels[1] as TextChannel);
		// Create messagePoll
	}

	public endTurn(): void {
		this.poll!.getResults();

		// Get poll votes
		// Send message based on poll results
		// Change status of picked player in database
	}

	getInfo(): IRoleInfo {
		return {
			id: RolesEnum.WEREWOLF,
			name: "Werewolf",
			description: "",
			emote: "🐺"
		};
	}
}

export default WerewolfRole;