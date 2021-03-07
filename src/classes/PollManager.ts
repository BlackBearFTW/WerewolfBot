import {Message, MessageEmbed} from "discord.js";

class PollManager {
    private static instance: PollManager

    private constructor() {}

    public static getInstance(): PollManager {
        if (!PollManager.instance) {
            PollManager.instance = new PollManager();
        }

        return PollManager.instance;
    }


    public formatPoll(title: string, options: string[]): MessageEmbed {
        const numEmote = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹", "🇺", "🇻", "🇼", "🇽", "🇾", "🇿"];
        const embed = new MessageEmbed();
        let body = "";

        for (const [index, option] of options.entries()) {
            body += `${numEmote[index]} ${option}\n`;
        }

        embed.setTitle(title);
        embed.setDescription(body);

        return embed;
    }



}

export default PollManager;