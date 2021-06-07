import { Message, MessageEmbed, TextChannel} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import {embedColors} from "../../config.json";
import ParticipationService from "../../services/ParticipationService";
import ErrorUtil from "../../utils/ErrorUtil";

class KickCommand extends BaseCommand {
	constructor() {
		super(
			"kick",
			"Kicks the mentioned user",
			{
				onlyLeader: true,
				onlyInLobby: true,
				selfDestruct: true
			}
		);
	}

	async execute(message: Message, args: string[]) {
		try {
			if (message.mentions.users.size === 0) return ErrorUtil.throwError(message, "You need to mention your victim.");

			const kickedUser = message.mentions.users.first()!;

			if (kickedUser.id === message.author.id) {
				return ErrorUtil.throwError(message, "You idiot, did you really just try to kick yourself?");
			}

			const participationService = new ParticipationService();

			const channel = message.channel as TextChannel;

			if (!await participationService.isParticipant(kickedUser, channel.parent!)) return;

			await participationService.removeUser(kickedUser, channel.parent!);

			const embed = new MessageEmbed();

			embed.setTitle("Kicked User");
			embed.setColor(embedColors.neutralColor);
			embed.setDescription(`Successfully kicked ${kickedUser}`);

			await message.channel.send(embed);
		} catch (error) {
			console.log(error);
		}
	}
}

export default KickCommand;