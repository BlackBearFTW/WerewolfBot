import {CategoryChannel, Channel, GuildCreateChannelOptions, Message, PermissionOverwrites} from "discord.js";

class DiscordUtil {

    static async createCategory(message: Message, name: string, permission: any[]): Promise<CategoryChannel> {

        return await message.guild?.channels.create(name, {
            type: 'category',
            permissionOverwrites: permission
        })!;

    }

    static async createChannel(category: CategoryChannel, name: string, type: "text" | "voice", permission?: any[]): Promise<Channel> {
        return category.guild?.channels.create(name, {
            type: type,
            parent: category.id,
            permissionOverwrites: permission
        });
    }

}

export default DiscordUtil;