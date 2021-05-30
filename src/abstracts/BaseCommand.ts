import {Message} from "discord.js";

abstract class BaseCommand {
	private readonly name: string;
	private readonly description: string;

	protected constructor(name: string, description: string) {
		this.name = name;
		this.description = description;
	}

	// @ts-ignore
	abstract async execute(message: Message, args?: string[]): Promise<void>;

	getName(): string {
		return this.name;
	}

	getDescription(): string {
		return this.description;
	}
}

export default BaseCommand;
