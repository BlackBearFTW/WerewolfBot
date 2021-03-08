import {Message} from "discord.js";
import {client} from "../index.js";
import {EventInterface} from "../interfaces/EventInterface";
import CommandsHandler from "../handlers/CommandsHandler.js";

export const event: EventInterface = {
    name: 'message',
    once: false,
    disabled: false,
    async execute(message: Message) {
        const commandHandler = CommandsHandler.getInstance();
        commandHandler.registerFiles("!w", "./commands");
        const data = commandHandler.parseCommand(message)!;
        await commandHandler.executeCommand(message, data.command, data.args);
    }
};