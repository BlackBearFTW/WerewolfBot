import {CommandInteraction} from "discord.js";

interface GuardMethodInterface {
    (interaction: CommandInteraction, next: Function, fail: (title: string, description: string) => void): void
}

export default GuardMethodInterface;