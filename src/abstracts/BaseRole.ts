import RolesEnum from "../types/RolesEnum";

abstract class BaseRole {
	private readonly id: RolesEnum;

	protected constructor(id: RolesEnum) {
		this.id = id;
	}

	// @ts-ignore
	abstract async execute(...args: any[]): Promise<void>;

	getId(): string {
		return this.id;
	}
}

export default BaseRole;