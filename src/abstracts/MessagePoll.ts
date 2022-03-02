import {MessageActionRow, MessageEmbed, MessageSelectMenu, TextChannel} from "discord.js";
import {v4 as uuid} from "uuid";

class MessagePoll {
	private id: string;

	// eslint-disable-next-line no-useless-constructor,no-empty-function
	constructor(private title: string, private description: string, private options: string[]) {
		this.id = uuid();
	}

	private buildPoll(): MessageEmbed {
		const embed = new MessageEmbed();

		embed.setTitle(this.title);
		embed.setDescription(this.description);
		return embed;
	}

	public send(destination: TextChannel) {
		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId(this.id)
				.setPlaceholder("Nothing selected")
				.addOptions(this.options.map(item => ({
					label: item,
					value: item.toLowerCase()
				}))),
		);

		destination.send({embeds: [this.buildPoll()], components: [row]});
	}

	public getResults() {
		// Get Interaction
		// Check if interaction is selection menu with id
		// Get embed vote count;
	}
}

export default MessagePoll;