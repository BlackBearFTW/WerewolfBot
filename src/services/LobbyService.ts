import Singleton from "../decorators/Singleton";
import {CategoryChannel, Channel, Message, MessageEmbed, TextChannel, User} from "discord.js";
import {v4 as uuid} from "uuid";
import { embedColors } from "../config.json";
import LobbyRepository from "../repositories/LobbyRepository";
import {client} from "../index";
import LobbyData from "../data/LobbyData";
import UserRepository from "../repositories/UserRepository";
import UserData from "../data/UserData";
import ParticipationRepository from "../repositories/ParticipationRepository";
import ParticipationData from "../data/ParticipationData";
import DiscordUtil from "../utils/DiscordUtil";

@Singleton
class LobbyService {
	async setupLobby(message: Message) {
		const category = await this.createCategory(message);
		const informationChannel = await this.createChannels(message, category!);
		const inviteCode = uuid().substr(-6).toUpperCase();

		await this.sendInitialMessages(informationChannel!, inviteCode);

		const lobbyData = new LobbyData();
		const lobbyRepository = new LobbyRepository();

		lobbyData.invite_code = inviteCode;
		lobbyData.guild = message.guild!.id;
		lobbyData.category = category!.id;

		await lobbyRepository.create(lobbyData);

		return inviteCode;
	}

	private async createCategory(message: Message) {
		return await DiscordUtil.createCategory(`WEREWOLF LOBBY: ${message.author.username}`, message.guild!, [{
			id: message.guild?.roles.everyone.id!,
			deny: ["VIEW_CHANNEL"]
		}]);
	}

	private async createChannels(message: Message, category: CategoryChannel) {
		const channelNames = ["📖｜information", "🔑｜lobby", "🎲｜moves", "🎤｜voice"];
		const channels: Channel[] = [];

		for (const item of channelNames) {
			const newChannel = await DiscordUtil.createChannel(item, category);

			channels.push(newChannel);
		}

		const informationChannel = channels[0] as TextChannel;
		const movesChannel = channels[2] as TextChannel;

		await informationChannel?.updateOverwrite(message.guild?.roles.everyone!, {
			SEND_MESSAGES: false
		});

		await movesChannel?.updateOverwrite(message.guild?.roles.everyone!, {
			SEND_MESSAGES: false,
			VIEW_CHANNEL: false
		});

		return informationChannel;
	}

	private async sendInitialMessages(channel: TextChannel, code: string) {
		const embed = new MessageEmbed();

		embed.setTitle("Invite Code");
		embed.setDescription(`Use Code \`${code}\` To Join This Lobby`);
		embed.setColor(embedColors.neutralColor);

		await channel.send(embed);
	}

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

		// Todo: insert user as part of lobby in database
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

		// Todo: Remove user from lobby in database
	}
}

export default LobbyService;