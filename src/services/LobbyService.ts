import Singleton from "../types/decorators/Singleton";
import {CategoryChannel, Channel, Message, MessageEmbed, TextChannel} from "discord.js";
import {v4 as uuid} from "uuid";
import { embedColors } from "../config.json";
import LobbyRepository from "../repositories/LobbyRepository";
import LobbyData from "../data/LobbyData";
import DiscordUtil from "../utils/DiscordUtil";
import DateUtil from "../utils/DateUtil";

@Singleton
class LobbyService {
	async setupLobby(message: Message) {
		const inviteCode = uuid().substr(-6).toUpperCase();
		const category = await this.createCategory(message, inviteCode);
		const informationChannel = await this.createChannels(message, category!);

		await this.sendInitialMessages(informationChannel!, inviteCode);

		const lobbyData = new LobbyData();
		const lobbyRepository = new LobbyRepository();

		lobbyData.invite_code = inviteCode;
		lobbyData.guild = message.guild!.id;
		lobbyData.category = category!.id;

		await lobbyRepository.create(lobbyData);

		return inviteCode;
	}

	private async createCategory(message: Message, inviteCode: string) {
		return await DiscordUtil.createCategory(`WEREWOLF LOBBY: ${inviteCode}`, message.guild!, [{
			id: message.guild?.roles.everyone.id!,
			deny: ["VIEW_CHANNEL"]
		}]);
	}

	private async createChannels(message: Message, category: CategoryChannel) {
		const channelNames = ["📖｜information", "💬｜main", "🎲｜moves", "🎤｜voice"];
		const channels: Channel[] = [];

		for (const item of channelNames) {
			if (item === "🎤｜voice") {
				channels.push(await DiscordUtil.createChannel(item, category, "voice"));
			} else {
				channels.push(await DiscordUtil.createChannel(item, category));
			}
			await DateUtil.sleep(500);
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

	async deleteLobby(message: Message, category: CategoryChannel) {
		const lobbyRepository = new LobbyRepository();

		const lobbyData = await lobbyRepository.findByCategory(category);

		if (lobbyData === null) return null;

		category.children.map(channel => channel.delete());

		await category.delete();

		await lobbyRepository.delete(lobbyData);
	}

	async hasStarted(inviteCode: string) {
		const lobbyRepository = new LobbyRepository();

		const lobbyData = await lobbyRepository.findByInviteCode(inviteCode);

		if (lobbyData === null) return null;

		return lobbyData.started;
	}
}

export default LobbyService;