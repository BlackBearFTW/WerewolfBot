import {Message} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import LobbyService from "../../services/LobbyService";

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
			const lobbyService = new LobbyService();

			if (!args[0]) return;

			await lobbyService.removeUser(message.author, args[0]);
		} catch (error) {
			console.log(error);
		}
	}
}

export default LeaveCommand;