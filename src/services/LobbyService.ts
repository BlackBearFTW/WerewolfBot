import Singleton from "../decorators/Singleton";
import {CategoryChannel, Channel, Message, MessageEmbed, TextChannel} from "discord.js";
import {v4 as uuid} from "uuid";
import { embedColors } from "../config.json";
import LobbyRepository from "../repositories/LobbyRepository";
import LobbyData from "../data/LobbyData";
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
}

export default LobbyService;