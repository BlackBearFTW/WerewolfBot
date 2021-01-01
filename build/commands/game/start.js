import { MessageEmbed } from "discord.js";
import { link } from "../../index.js";
export const command = {
    name: 'start',
    async execute(message, args) {
        var _a, _b, _c;
        const guildID = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id;
        const categoryID = (_b = message.channel.parent) === null || _b === void 0 ? void 0 : _b.id;
        const [result] = await link.execute("SELECT * FROM matches WHERE CATEGORY_ID = ? AND GUILD_ID = ?", [categoryID, guildID]);
        if (result.length < 0)
            return;
        const channelMap = (_c = message.channel.parent) === null || _c === void 0 ? void 0 : _c.children;
        if (channelMap === undefined)
            return;
        const fetchedChannel = channelMap.array()[1];
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
        const sendMessage = await fetchedChannel.send({ embed: embed, content: "**You Have 30 Seconds To Decide**" });
        for (const arg of args) {
            await sendMessage.react(numEmote[args.indexOf(arg)]);
        }
        await setTimeout(async () => {
            const collected = sendMessage.reactions.cache.filter((reaction) => {
                return reaction.count > 1;
            });
            if (collected.size > 0) {
                const sortedCollection = collected.sort((a, b) => { return a.count - b.count; });
                const filteredCollection = sortedCollection.filter((item) => {
                    var _a;
                    return ((_a = sortedCollection.first()) === null || _a === void 0 ? void 0 : _a.count) === item.count;
                });
                if (filteredCollection.size > 1) {
                    embed.setTitle("It's a tie!");
                    embed.setDescription("Nobody got lynched because the votes tied");
                }
                else {
                    embed.setTitle(`${args[numEmote.indexOf(filteredCollection.firstKey())]} was eliminated!`);
                    embed.setDescription('');
                }
                await sendMessage.delete();
                await sendMessage.channel.send(embed);
            }
            else {
                embed.setTitle("Not hungry?");
                embed.setDescription("Nobody got lynched because nobody ordered anything");
                await sendMessage.delete();
                await sendMessage.channel.send(embed);
            }
        }, 30000);
    }
};
