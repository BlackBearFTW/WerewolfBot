import {Message} from "discord.js";
import CommandOptionsInterface from "../interfaces/CommandOptionsInterface";

abstract class BaseCommand {
	private readonly name: string;
	private readonly description: string;
	private readonly options: CommandOptionsInterface
	private readonly defaultOptions: CommandOptionsInterface = {
		selfDestruct: false,
		onlyInLobby: false,
		onlyLeader: false,
		disableWhenStarted: false
	}

	protected constructor(name: string, description: string, options?: CommandOptionsInterface) {
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

	getProperty(key: keyof CommandOptionsInterface): boolean {
		return this.options[key]!;
	}

	getAllProperties(): CommandOptionsInterface {
		return this.options;
	}
}

export default BaseCommand;
