import { Message, TextChannel} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import LobbyService from "../../services/LobbyService";
import NotificationUtil from "../../utils/NotificationUtil";

class DeleteCommand extends BaseCommand {
	constructor() {
		super(
			"delete",
			"Deletes the current lobby",
			{
				onlyLeader: true,
				onlyInLobby: true,
				selfDestruct: true
			}
		);
	}

	async execute(message: Message, args: string[]) {
		try {
			const lobbyService = new LobbyService();

			const channel = message.channel as TextChannel;

			await NotificationUtil.sendConfirmationEmbed(message, "Are you sure you want to delete this lobby?");

			await lobbyService.deleteLobby(message, channel.parent!);
		} catch (error) {
			console.log(error);
		}
	}
}

export default DeleteCommand;