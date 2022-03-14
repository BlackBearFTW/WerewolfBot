import {Collection, Interaction, MessageSelectMenu} from "discord.js";
import {v4 as uuid} from "uuid";
import DiscordUtil from "../utils/DiscordUtil";

class SelectMenuHelper {
	private id: string;
	private callback: (interaction: Interaction) => Promise<void> = this.interactionCallback;
	private readonly results = new Collection<String, String[]>();
	public component: MessageSelectMenu;
	// eslint-disable-next-line
	constructor(private options: string[]) {
		this.id = uuid();

		this.component = new MessageSelectMenu()
			.setCustomId(this.id)
			.setPlaceholder("Nothing selected")
			.addOptions(this.options.map(item => ({
				label: item,
				value: item.toLowerCase()
			})));
	}

	public startListener() {
		this.callback = this.interactionCallback.bind(this);
		DiscordUtil.getClient().on("interactionCreate", this.callback);
	}

	public stopListener(disable = true) {
		DiscordUtil.getClient().removeListener("interactionCreate", this.callback);
		this.component.setDisabled(disable);
	}

	public getResults() {
		return Object.fromEntries(this.results);
	}

	/*

    	Public getMostCommon() {
		// Filters the object to only get the key value pairs with the longest array lengths (may return multiple pairs)
		return Object.fromEntries(
			Array.from(this.results.keys())
				.sort((curr, next) => this.results.get(next)!.length - this.results.get(curr)!.length)
				.filter(item => this.results.first()!.length === this.results.get(item)!.length)
				.map(o => [o, this.results.get(o)])
		);
	}
     */

	private async interactionCallback(interaction: Interaction) {
		if (!interaction.isSelectMenu() || interaction.customId !== this.id) return;

		this.results.set(
			interaction.values[0],
			this.results.has(interaction.values[0]) ? [...this.results.get(interaction.values[0])!, interaction.user.id] : [interaction.user.id]
		);

		await interaction.deferUpdate();
	}
}

export default SelectMenuHelper;