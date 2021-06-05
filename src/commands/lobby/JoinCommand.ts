import {Message} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import LobbyService from "../../services/LobbyService";
import ErrorUtil from "../../utils/ErrorUtil";

class JoinCommand extends BaseCommand {
	constructor() {
		super(
			"join",
			"Joins an existing lobby category",
		);
	}

	async execute(message: Message, args: string[]) {
		try {
			const lobbyService = new LobbyService();

			if (!args[0]) return;

			// Todo: Add check to see if invite code is legit

			const addedUser = await lobbyService.addUser(message.author, args[0]);

			if (addedUser === null) {
				await ErrorUtil.throwError(message, "Unknown invite code.", undefined, false);
			}
		} catch (error) {
			console.log(error);
		}
	}
}

export default JoinCommand;