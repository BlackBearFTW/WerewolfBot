import {BitFieldResolvable, Intents, IntentsString} from "discord.js";

class DiscordUtil {
	// Static async createChannel(name: string, category: CategoryChannel, type?: "text" | "voice", permissionOverwrite?: any[]) {
	// 	Return await category.guild.channels.create(name, {
	// 		Type: type || "text",
	// 		Parent: category,
	// 		PermissionOverwrites: permissionOverwrite
	// 	});
	// }
	//
	// Static async createCategory(name: string, guild: Guild, permissionOverwrite?: any[]) {
	// 	Return await guild.channels.create(name, {
	// 		Type: "category",
	// 		PermissionOverwrites: permissionOverwrite
	// 	});
	// }
	//
	// Static async getVoiceChannelMembers(voiceChannel: VoiceChannel) {
	// 	Return voiceChannel.members.array();
	// }
	//
	// Static async muteVoiceChannel(voiceChannel: VoiceChannel, muted: boolean) {
	// 	VoiceChannel.members.map(member => {
	// 		Member.voice.setMute(muted);
	// 	});
	// }

	static getAllIntents(): BitFieldResolvable<IntentsString, number> {
		// Stole... copied from an older version of discord.js...
		// https://github.com/discordjs/discord.js/blob/51551f544b80d7d27ab0b315da01dfc560b2c115/src/util/Intents.js#L75
		return Object.values(Intents.FLAGS).reduce((acc, p) => acc | p, 0);
	}
}

export default DiscordUtil;