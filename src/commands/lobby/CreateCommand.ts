import {Message} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import LobbyService from "../../services/LobbyService";

class CreateCommand extends BaseCommand {
	constructor() {
		super(
			"create",
			"Creates a new lobby category"
		);
	}

	async execute(message: Message, args: string[]) {
		try {
			const lobbyService = new LobbyService();
			const category = await lobbyService.setupLobby(message);

			lobbyService.addUser(message.author, category, true);
		} catch (error) {
			console.log(error);
		}
	}
}

export default CreateCommand;