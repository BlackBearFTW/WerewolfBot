import {Message, TextChannel} from "discord.js";
import BaseCommand from "../../abstracts/BaseCommand";
import ParticipationRepository from "../../repositories/ParticipationRepository";
import LobbyRepository from "../../repositories/LobbyRepository";
class LeaderCommand extends BaseCommand {
	constructor() {
		super(
			"leader",
			"Says who the leader is",
			{
				onlyInLobby: true,
				selfDestruct: true
			}
		);
	}

	async execute(message: Message, args: string[]) {
		try {
			const participationRepository = new ParticipationRepository();
			const lobbyRepository = new LobbyRepository();
			const channel = message.channel as TextChannel;

			const lobbyData = await lobbyRepository.findByCategory(channel.parent!);

			const participationData = await participationRepository.getLeader(lobbyData?.id!);

			const guildMember = await message.guild?.members.fetch(participationData?.user_id!);

			await message.channel.send(`${guildMember?.user.username} is the lobby leader.`);
		} catch (error) {
			console.log(error);
		}
	}
}

export default LeaderCommand;