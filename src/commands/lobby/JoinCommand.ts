import BaseCommand from "../../abstracts/BaseCommand";
import {CommandInteraction, MessageEmbed} from "discord.js";
import {getConnection} from "typeorm";
import {Lobby} from "../../entities/LobbyEntity";
import {User} from "../../entities/UserEntity";
import {Participation} from "../../entities/ParticipationEntity";

/* @SlashCommand("poll", "Shows test poll")
@SlashOption("foo", "description", {required: true, choices: [], type: "STRING"})
@SlashOption("bar", "description", {required: true, choices: [], type: "STRING"})*/
class JoinCommand extends BaseCommand {
	constructor() {
		super({
			name: "join",
			description: "Join an existing lobby",
			options: [{
				name: "invite_code",
				description: "the invite code of the game",
				type: "STRING",
				required: true
			}]
		});
	}

	async onInteraction(interaction: CommandInteraction): Promise<void> {
		const entityManager = getConnection().createEntityManager();
		const inviteCode = interaction.options.getString("invite_code", true);

		const lobby = await entityManager.findOne(Lobby, {
			where: {
				inviteCode
			}
		});

		if (!lobby || lobby?.participations.filter(x => x.user.id === interaction.user.id).length > 0) {
			return interaction.reply({
				ephemeral: true,
				embeds: [new MessageEmbed({
					title: "Unable to find lobby",
					description: "Check if the invite code is correct and try again.",
					color: "RED"
				})]
			});
		}

		let fetchedUser = await entityManager.findOne(User, interaction.user.id);

		if (!fetchedUser) {
			fetchedUser = entityManager.create(User, {
				id: interaction.user.id
			});

			await entityManager.save(fetchedUser);
		}

		lobby.participations.push(entityManager.create(Participation, {
			user: fetchedUser
		}));

		await interaction.reply({
			ephemeral: true,
			embeds: [new MessageEmbed({
				title: "Joined Lobby"
			})]
		});
	}
}

export default JoinCommand;