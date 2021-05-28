import {ClientEvents} from "discord.js";

interface EventInterface {
    name: keyof ClientEvents;
    once: boolean;
    disabled: boolean;
    // @ts-ignore
    execute(...parameters?: any[]): void;
}