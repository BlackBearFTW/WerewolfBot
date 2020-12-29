import {Message, TextChannel, User} from "discord.js";
import {CommandInterface} from "../../interfaces/CommandInterface";
import {client, link} from "../../index.js";

export const command: CommandInterface = {
    name: 'start',
    async execute(message: Message, args: string[]) {

        const guildID = message.guild?.id;
        const categoryID = (<TextChannel>message.channel).parent?.id;
        const [result]: any[] = await link.execute("SELECT * FROM matches WHERE CATEGORY_ID = ? AND GUILD_ID = ?", [categoryID, guildID]);

        if (result.length < 0) return;

        const channelMap = (message.channel as TextChannel).parent?.children; // get category

        if (channelMap === undefined) return;

        const fetchedChannel= channelMap.array()[1] as TextChannel;

        await fetchedChannel.createOverwrite(message.author, {
            VIEW_CHANNEL: true
        });


        const sendMessage = await fetchedChannel.send("React to this message");
        await sendMessage.react("👍");
        await sendMessage.react("👎");

        const filter = (reaction: any, user: User) => reaction.emoji.name === '👍' || reaction.emoji.name === '👎';

        const collected = await sendMessage.awaitReactions(filter, {time: 30000});
        await sendMessage.channel.send(`Collected ${collected.size} reactions`);


        // setTimeout(async () => {
        //
        //     await fetchedChannel.permissionOverwrites.get(message.author.id)?.delete();
        //
        // }, 30000);
    }
};
