import {ClientEvents} from "discord.js";

interface EventInterface {
    name: keyof ClientEvents;
    once: boolean;
    disabled: boolean;
    execute(...parameters?: any[]): void;
}