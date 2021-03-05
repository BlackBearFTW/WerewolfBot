import {Message} from "discord.js";

export interface CommandInterface {
    name: string;
    description?: string;
    arguments?: string;
    execute(message: Message, args: string[]): void;
}