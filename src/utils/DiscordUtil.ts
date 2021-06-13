import {CategoryChannel, Guild, VoiceChannel} from "discord.js";

class DiscordUtil {
	static async createChannel(name: string, category: CategoryChannel, type?: "text" | "voice", permissionOverwrite?: any[]) {
		return await category.guild.channels.create(name, {
			type: type || "text",
			parent: category,
			permissionOverwrites: permissionOverwrite
		});
	}

	static async createCategory(name: string, guild: Guild, permissionOverwrite?: any[]) {
		return await guild.channels.create(name, {
			type: "category",
			permissionOverwrites: permissionOverwrite
		});
	}

	static async getVoiceChannelMembers(voiceChannel: VoiceChannel) {
		return voiceChannel.members.array();
	}
}

export default DiscordUtil;