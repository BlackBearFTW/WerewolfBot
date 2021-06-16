import RolesEnum from "../types/RolesEnum";

abstract class BaseRole {
	private readonly id: RolesEnum;
	private readonly name: string;
	private readonly description: string;
	private readonly emote: string;
	private readonly turn_position: number;

	protected constructor(id: RolesEnum, name: string, description: string, emote: string, turn_position: number) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.emote = emote;
		this.turn_position = turn_position;
	}

	// @ts-ignore
	abstract async execute(...args: any[]): Promise<void>;

	getId(): string {
		return this.id;
	}

	getName(): string {
		return this.name;
	}

	getDescription(): string {
		return this.description;
	}

	getEmote(): string {
		return this.emote;
	}

	getTurnPosition(): number {
		return this.turn_position;
	}
}

export default BaseRole;