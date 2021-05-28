import {Message} from "discord.js";

abstract class BaseCommand {
	name: string;
	description: string;
	options?: Object;

	protected constructor(name: string, description: string, options?: Object) {
		this.name = name;
		this.description = description;
		this.options = options;
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
