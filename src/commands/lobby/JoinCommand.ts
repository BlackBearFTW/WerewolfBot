import {Message} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import ErrorUtil from "../../utils/ErrorUtil";
import ParticipationService from "../../services/ParticipationService";

class JoinCommand extends BaseCommand {
	constructor() {
		super(
			"join",
			"Joins an existing lobby category",
		);
	}

	async execute(message: Message, args: string[]) {
		try {
			// Todo: Add check to see if invite code is legit
			const participationService = new ParticipationService();

			if (!args[0]) return;

			if (await participationService.isParticipant(message.author, args[0])) {
				return await ErrorUtil.throwError(message, "You are already part of this lobby.");
			}

			const addedUser = await participationService.addUser(message.author, args[0]);

			if (addedUser === null) {
				await ErrorUtil.throwError(message, "Unknown invite code.", undefined, false);
			}
		} catch (error) {
			console.log(error);
		}
	}
}

export default JoinCommand;