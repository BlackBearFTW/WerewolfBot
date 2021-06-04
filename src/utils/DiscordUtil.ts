import {CategoryChannel, PermissionOverwrites} from "discord.js";

class DiscordUtil {
	static async createChannel(name: string, category: CategoryChannel, type?: "text" | "voice", permissionOverwrite?: PermissionOverwrites[]) {
		return await category.guild.channels.create(name, {
			type: type || "text",
			permissionOverwrites: permissionOverwrite
		});
	}
}

export default DiscordUtil;