import {CommandInteraction} from "discord.js";

interface ICommand {
    onInteraction: (interaction: CommandInteraction) => Promise<void>;
}

export default ICommand;