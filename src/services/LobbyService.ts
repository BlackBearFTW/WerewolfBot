import Singleton from "../decorators/Singleton";
import {CategoryChannel, Message, MessageEmbed, TextChannel, User} from "discord.js";
import {v4 as uuid} from "uuid";

@Singleton
class LobbyService {
	async setupLobby(message: Message) {
		const category = await this.createCategory(message);
		const informationChannel = await this.createChannels(message, category!);
		const inviteCode = uuid().substr(-6).toUpperCase();

		await this.sendInitialMessages(informationChannel!, inviteCode);
		return category!;
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
		embed.setColor("#206694");

		await channel.send(embed);
	}

	addUser(user: User, category: CategoryChannel, lobbyLeader = false) {
		category.createOverwrite(user, {
			VIEW_CHANNEL: true
		});
	}
}

export default LobbyService;