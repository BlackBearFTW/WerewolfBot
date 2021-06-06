import {Message, TextChannel} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import ParticipationService from "../../services/ParticipationService";

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

			await participationService.removeUser(message.author, channel.parent!);
		} catch (error) {
			console.log(error);
		}
	}
}

export default LeaveCommand;