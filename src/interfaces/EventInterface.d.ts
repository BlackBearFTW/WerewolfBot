import {ClientEvents} from "discord.js";

interface EventInterface {
    name: keyof ClientEvents;
    once: boolean;
    execute(arguments?: any): void;
}