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

        await fetchedChannel.bulkDelete(100);

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

        const sendMessage = await fetchedChannel.send({embed: embed, content: "**You Have 30 Seconds To Decide**"});
        for (const arg of args) {
           await sendMessage.react(numEmote[args.indexOf(arg)]);
        }

        await setTimeout(async() => {
            const collected = sendMessage.reactions.cache.filter((reaction): boolean => {
                return reaction.count! > 1;
            })

            if (collected.size > 0) {
                const sortedCollection = collected.sort((a, b):number => {return a.count! - b.count!});
                const filteredCollection = sortedCollection.filter((item) => {
                    return sortedCollection.first()?.count === item.count;
                })

                if (filteredCollection.size > 1) {
                    embed.setTitle("It's a tie!");
                    embed.setDescription("Nobody got lynched because the votes tied");
                } else {
                    embed.setTitle(`${args[numEmote.indexOf(filteredCollection.firstKey()!)]} was eliminated!`);
                    embed.setDescription('');
                }

                await sendMessage.delete();
                await sendMessage.channel.send(embed)

            } else {
                embed.setTitle("Not hungry?");
                embed.setDescription("Nobody got lynched because nobody ordered anything");
                await sendMessage.delete();
                await sendMessage.channel.send(embed);
            }


        }, 30000);
    }
};
