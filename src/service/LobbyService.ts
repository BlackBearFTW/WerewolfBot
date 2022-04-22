import {CategoryChannel, Guild, User} from "discord.js";
import {ChannelTypes} from "discord.js/typings/enums";

class LobbyService {
	public async setupDiscordStructure(user: User, guild: Guild, inviteCode: string) {
		const category = await guild.channels.create(`WEREWOLF LOBBY: ${inviteCode}`, {
			type: ChannelTypes.GUILD_CATEGORY,
			permissionOverwrites: [{
				id: user,
				allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
			}, {
				id: guild.roles.everyone,
				deny: ["SEND_MESSAGES", "VIEW_CHANNEL"]
			}]
		});

		await category.createChannel("pre-game");
		await category.createChannel("make-your-turn", {
			permissionOverwrites: [{
				id: guild.roles.everyone,
				deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
			}]
		});
		await category.createChannel("voice", {
			type: ChannelTypes.GUILD_VOICE
		});

		return [guild, category];
	}

	public async deleteDiscordStructure(category: CategoryChannel) {
		category.children.map(x => x.delete());
		await category.delete();
	}
}

export default LobbyService;