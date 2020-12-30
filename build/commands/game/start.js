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
        const filter = (reaction, user) => numEmote.includes(reaction.emoji.name) && !user.bot;
        const collected = await sendMessage.awaitReactions(filter, { time: 30000 });
        for (const [key, value] of collected) {
            fetchedChannel.send(`${key} was clicked ${value.count - 1}x`);
        }
        const sortedCollection = collected.sort((a, b) => a.count - b.count);
        fetchedChannel.send(sortedCollection.firstKey());
    }
};
