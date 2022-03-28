import {ApplicationCommandData, CommandInteraction} from "discord.js";
import ICommandOptions from "../types/interfaces/CommandOptionsInterface";

abstract class BaseCommand {
	private readonly slashCommandData: ApplicationCommandData;
	private readonly customOptions: ICommandOptions;
	private readonly defaultOptions: ICommandOptions = {
		onlyInLobby: false,
		onlyLeader: false,
		disableWhenStarted: false
	};

	protected constructor(slashCommandData: ApplicationCommandData, customOptions?: ICommandOptions) {
		this.slashCommandData = slashCommandData;
		this.customOptions = {...this.defaultOptions, ...customOptions};
	}

	// @ts-ignore
	abstract async onInteraction(interaction: CommandInteraction): Promise<void>;

	getName = (): string => this.slashCommandData.name;

	getSlashCommandData = (): ApplicationCommandData => this.slashCommandData;

	getProperty = (key: keyof ICommandOptions): boolean => this.customOptions[key]!;
}

export default BaseCommand;
