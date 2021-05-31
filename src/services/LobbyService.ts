import Singleton from "../decorators/Singleton";
import {CategoryChannel, Message, MessageEmbed, TextChannel, User} from "discord.js";
import {v4 as uuid} from "uuid";
import { neutralColor } from "../config.json";
import LobbyRepository from "../repositories/LobbyRepository";
import {client} from "../index";
import LobbyData from "../data/LobbyData";

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
		return await message.guild?.channels.create(`WEREWOLF MATCH: ${message.author.username}`, {
			type: "category",
			permissionOverwrites: [{
				id: message.guild?.roles.everyone.id,
				deny: ["VIEW_CHANNEL"]
			}]
		});
	}

	private async createChannels(message: Message, category: CategoryChannel) {
		const informationChannel = await message.guild?.channels.create("📖｜information", {
			type: "text",
			parent: category.id
		});

		await message.guild?.channels.create("🎤｜lobby", {
			type: "text",
			parent: category.id
		});

		await message.guild?.channels.create("🎲｜moves", {
			type: "text",
			parent: category.id,
			permissionOverwrites: [{
				id: message.guild.roles.everyone.id,
				deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
			}]
		});

		await message.guild?.channels.create("🎤｜voice", {
			type: "voice",
			parent: category.id
		});

		return informationChannel;
	}

	private async sendInitialMessages(channel: TextChannel, code: string) {
		const embed = new MessageEmbed();

		embed.setTitle("Invite Code");
		embed.setDescription(`Use Code \`${code}\` To Join This Lobby`);
		embed.setColor(neutralColor);

		await channel.send(embed);
	}

	async addUser(user: User, inviteCode: string, lobbyLeader = false) {
		const lobbyRepository = new LobbyRepository();
		const lobbyData = await lobbyRepository.getByInviteCode(inviteCode);

		const category = await client.channels.fetch(lobbyData.category!);

		// eslint-disable-next-line no-extra-parens
		await (category as CategoryChannel).createOverwrite(user, {
			VIEW_CHANNEL: true
		});

		// Todo: Check if user exists and if not create in database, otherwise insert as part of lobby
	}

	async leaveU
}

export default LobbyService;