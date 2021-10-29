import {CommandInteraction} from "discord.js";
import CommandOptionsInterface from "../types/interfaces/CommandOptionsInterface";

abstract class BaseCommand {
	private readonly name: string;
	private readonly description: string;
	private readonly customOptions: CommandOptionsInterface;
	private readonly defaultOptions: CommandOptionsInterface = {
		onlyInLobby: false,
		onlyLeader: false,
		disableWhenStarted: false
	};

	protected constructor(name: string, description: string, options?: CommandOptionsInterface) {
		this.name = name;
		this.description = description;
		this.customOptions = {...this.defaultOptions, ...options};
	}

	// @ts-ignore
	abstract async execute(interaction: CommandInteraction): Promise<void>;

	getName(): string {
		return this.name;
	}

	getDescription(): string {
		return this.description;
	}

	getProperty(key: keyof CommandOptionsInterface): boolean {
		return this.customOptions[key]!;
	}
}

export default BaseCommand;
