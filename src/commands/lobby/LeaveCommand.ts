import {Message, TextChannel} from "discord.js";
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

			const channel = message.channel as TextChannel;

			await lobbyService.removeUser(message.author, channel.parent!);
		} catch (error) {
			console.log(error);
		}
	}
}

export default LeaveCommand;