import BaseCommand from "../../abstracts/BaseCommand";
import {CommandInteraction, MessageActionRow, MessageEmbed} from "discord.js";
import SelectMenuHelper from "../../helpers/SelectMenuHelper";

class PollCommand extends BaseCommand {
	constructor() {
		super({
			name: "poll",
			description: "Shows test poll"
		});
	}

	async execute(interaction: CommandInteraction) {
		// Const attachment = new MessageAttachment(GifUtil.generateGif(), "file.gif");
		let currentCountdown = 30;
		const embed = new MessageEmbed({
			title: "Hello World",
			description: "Description Here",
			color: "RED"
		});

		// embed.setThumbnail("attachment://file.gif");

		const selector = new SelectMenuHelper([
			"Hello",
			"Jello",
			"Trello",
			"Fellow",
			"Shallow"
		]);

		await interaction.reply({
			content: `You have ${currentCountdown} seconds to decide`,
			embeds: [embed],
			components: [new MessageActionRow().addComponents(selector.component)]
		});

		selector.startListener();

		const interval = setInterval(() => {
			currentCountdown -= 5;

			if (!(currentCountdown <= 0)) interaction.editReply({content: `You have ${currentCountdown} seconds to decide`});

			if (currentCountdown <= 0) {
				clearInterval(interval);
				selector.stopListener();

				embed.setDescription(JSON.stringify(selector.getResults()));
				interaction.editReply({content: "You're out of time", components: [], embeds: [embed]});
			}
		}, 5000);
	}
}

export default PollCommand;