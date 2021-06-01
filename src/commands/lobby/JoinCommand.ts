import {Message} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import LobbyService from "../../services/LobbyService";

class CreateCommand extends BaseCommand {
	constructor() {
		super(
			"join",
			"Joins an existing lobby category",
			{
				selfDestruct: true
			}
		);
	}

	async execute(message: Message, args: string[]) {
		try {
			const lobbyService = new LobbyService();

			if (!args[0]) return;

			await lobbyService.addUser(message.author, args[0]);
		} catch (error) {
			console.log(error);
		}
	}
}

export default CreateCommand;