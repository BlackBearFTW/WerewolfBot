import fs from "fs";
import {Collection, Message} from "discord.js";
import {CommandInterface} from "../interfaces/CommandInterface";
import Global from "../classes/Global.js";

class CommandsHandler {

    private commands = new Collection<string, CommandInterface>();
    private readonly prefix: string;

    constructor(prefix: string, filePath: string, hasCategories: boolean) {
        this.prefix = prefix;

        if (hasCategories) {

            // Retrieves all folders inside the given folder and then the files inside those folders get imported
            const commandFolders = fs.readdirSync(filePath, {withFileTypes: true}).filter(folder => folder.isDirectory()).map(folder => folder.name);

            for (const folder of commandFolders) {
                const commandFiles = fs.readdirSync(`${filePath}/${folder}`).filter((file: string) => file.endsWith('.js'));

                for (const file of commandFiles) {
                    (async () => {
                        const {command} = await import(`${filePath}/${folder}/${file}`);
                        this.commands.set(command.name, command);
                    })();
                }
            }

        } else {


            // Retrieves all files inside given folder
            const commandFiles = fs.readdirSync(`${filePath}`).filter((file: string) => file.endsWith('.js'));

            for (const file of commandFiles) {
                (async () => {
                    const {command} = await import(`${filePath}/${file}`);
                    this.commands.set(command.name, command);
                })();
            }


        }

    }

    public async executeCommand(command: string, message: Message, args: string[]) {
        if (!this.commands.has(command)) await Global.throwError(message, "Unknown Command");

        this.commands.get(command)?.execute(message, args);
        message?.delete();
    }

    public formatMessage(message: Message) {
        if (!message.content.startsWith(this.prefix) || message.author.bot || message.channel.type != 'text') return;

        let mContent: string = message.content;
        let args = mContent.match(/[^\s"]+|"([^"]*)"/gi);

        if (args === null) return;

        args = args.map((mContent) => mContent.replace(/^"(.+(?="$))"$/, '$1'));

        args.shift();

        return {
            "command": args.shift()!,
            "args": args
        };
    }

}

export default CommandsHandler;