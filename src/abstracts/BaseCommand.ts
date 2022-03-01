import {ApplicationCommandData, CommandInteraction} from "discord.js";
import CommandOptionsInterface from "../types/interfaces/CommandOptionsInterface";

abstract class BaseCommand {
	private readonly slashCommandData: ApplicationCommandData;
	private readonly customOptions: CommandOptionsInterface;
	private readonly defaultOptions: CommandOptionsInterface = {
		onlyInLobby: false,
		onlyLeader: false,
		disableWhenStarted: false
	};

	protected constructor(slashCommandData: ApplicationCommandData, customOptions?: CommandOptionsInterface) {
		this.slashCommandData = slashCommandData;
		this.customOptions = {...this.defaultOptions, ...customOptions};
	}

	// @ts-ignore
	abstract async execute(interaction: CommandInteraction): Promise<void>;

	getName = (): string => this.slashCommandData.name;

	getSlashCommandData = (): ApplicationCommandData => this.slashCommandData;

	getProperty = (key: keyof CommandOptionsInterface): boolean => this.customOptions[key]!;
}

export default BaseCommand;
