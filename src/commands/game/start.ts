import {Message, MessageEmbed, ReactionCollector, TextChannel, User} from "discord.js";
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

        const numEmote = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹", "🇺", "🇻", "🇼", "🇽", "🇾", "🇿"];
        args[0] = "PersonA";
        args[1] = "PersonB";
        args[2] = "PersonC";
        args[3] = "PersonD";

        let desc = "";


        for (const arg of args) {
           desc += `${numEmote[args.indexOf(arg)]} ${arg}\n`;
        }

        const embed = new MessageEmbed();
        embed.setTitle("Tonight's Menu");
        embed.setDescription(desc);


        const sendMessage = await fetchedChannel.send(embed);
        for (const arg of args) {
           sendMessage.react(numEmote[args.indexOf(arg)]);
        }

        const filter = (reaction: any, user: User) => numEmote.includes(reaction.emoji.name) && !user.bot;

        const collected = await sendMessage.awaitReactions(filter, {time: 30000});
        for(const [key, value] of collected) {
            fetchedChannel.send(`${key} was clicked ${value.count! - 1}x`);
        }

        const sortedCollection = collected.sort((a, b) => a.count! - b.count!);
        fetchedChannel.send(sortedCollection.firstKey());

        // setTimeout(async () => {
        //
        //     await fetchedChannel.permissionOverwrites.get(message.author.id)?.delete();
        //
        // }, 30000);
    }
};
