import {Message} from "discord.js";
import {client} from "../index.js";
import {EventInterface} from "../interfaces/EventInterface";
import CommandsHandler from "../handlers/CommandsHandler";

export const event: EventInterface = {
    name: 'message',
    once: false,
    disabled: false,
    async execute(message: Message) {
        const commandHandler = new CommandsHandler("!w", "./commands", true);
        const data = commandHandler.formatMessage(message)!;
        await commandHandler.executeCommand(data.command, message, data.args);
    }
};