import {Message} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import LobbyService from "../../services/LobbyService";
import ParticipationService from "../../services/ParticipationService";

class CreateCommand extends BaseCommand {
	constructor() {
		super(
			"create",
			"Creates a new lobby category",
			{
				selfDestruct: true
			}
		);
	}

	async execute(message: Message, args: string[]) {
		try {
			const lobbyService = new LobbyService();
			const participationService = new ParticipationService();
			const inviteCode = await lobbyService.setupLobby(message);

			await participationService.addUser(message.author, inviteCode, true);
		} catch (error) {
			console.log(error);
		}
	}
}

export default CreateCommand;