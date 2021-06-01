import {Message} from "discord.js";
import CommandOptions from "../interfaces/CommandOptions";

abstract class BaseCommand {
	private readonly name: string;
	private readonly description: string;
	private readonly options: CommandOptions
	private readonly defaultOptions: CommandOptions = {
		selfDestruct: false,
		onlyInLobby: false,
		onlyLeader: false
	}

	protected constructor(name: string, description: string, options?: CommandOptions) {
		this.name = name;
		this.description = description;
		this.options = {...this.defaultOptions, ...options};
	}

	// @ts-ignore
	abstract async execute(message: Message, args?: string[]): Promise<void>;

	getName(): string {
		return this.name;
	}

	getDescription(): string {
		return this.description;
	}

	getProperty(key: keyof CommandOptions): boolean {
		return this.options[key]!;
	}

	getAllProperties(): CommandOptions {
		return this.options;
	}
}

export default BaseCommand;
