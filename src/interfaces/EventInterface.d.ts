import {ClientEvents} from "discord.js";

interface EventInterface {
    event: keyof ClientEvents;
    once: boolean;
    disabled: boolean;
    // @ts-ignore
    execute(...parameters?: any[]): void;
}