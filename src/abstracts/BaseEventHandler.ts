import {ClientEvents} from "discord.js";

abstract class BaseEventHandler {
	private readonly event: keyof ClientEvents;
	private readonly once: boolean;
	private readonly disabled?: boolean;

	protected constructor(event: keyof ClientEvents, once: boolean, disabled: boolean = false) {
		this.event = event;
		this.once = once;
		this.disabled = disabled;
	}

	// @ts-ignore
	abstract async handle(...args: any[]): Promise<void>;

	getEvent(): string {
		return this.event;
	}

	isDisabled(): boolean {
		return this.disabled!;
	}

	onlyOnce(): boolean {
		return this.once;
	}
}

export default BaseEventHandler;
