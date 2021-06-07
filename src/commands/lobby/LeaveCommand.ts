import {Message, TextChannel} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import ParticipationService from "../../services/ParticipationService";
import ErrorUtil from "../../utils/ErrorUtil";

class LeaveCommand extends BaseCommand {
	constructor() {
		super(
			"leave",
			"Leaves an existing lobby category",
			{
				selfDestruct: true,
				onlyInLobby: true
			}
		);
	}

	async execute(message: Message, args: string[]) {
		try {
			const participationService = new ParticipationService();

			const channel = message.channel as TextChannel;

			if (await participationService.isLeader(message.author, channel.parent!)) {
				return ErrorUtil.throwError(message, "You can't leave, use the transfer spell first.");
			}

			await participationService.removeUser(message.author, channel.parent!);
		} catch (error) {
			console.log(error);
		}
	}
}

export default LeaveCommand;