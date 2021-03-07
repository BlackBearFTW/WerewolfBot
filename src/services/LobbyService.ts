import {CategoryChannel, Message, MessageEmbed, TextChannel} from "discord.js";
import {client, connection} from "../index.js";
import DiscordUtil from "../utils/DiscordUtil.js";
import LobbyRepository from "../repositories/LobbyRepository.js";
import LobbyModel from "../models/LobbyModel.js";
import UserRepository from "../repositories/UserRepository.js";

class LobbyService {
    private static instance: LobbyService;

    private constructor() {}

    public static getInstance(): LobbyService {
        if (!LobbyService.instance) {
            LobbyService.instance = new LobbyService();
        }

        return LobbyService.instance;
    }

    async createLobby(message: Message): Promise<LobbyModel> {

       const category = await DiscordUtil.createCategory(message, `WEREWOLF LOBBY: ${message.author.username}`, [{
            id: message.guild?.roles.everyone.id,
            deny: ['VIEW_CHANNEL'],
        }]);

        await DiscordUtil.createChannel(category, "🔑-lobby", "text");
        await DiscordUtil.createChannel(category, "🎲-moves", "text", [{
            id: message.guild!.roles.everyone.id,
            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
        }]);
        await DiscordUtil.createChannel(category, "🎤-voice", "voice");

        const lobbyModel = new LobbyModel();
        lobbyModel.GUILD = message.guild!.id;
        lobbyModel.CATEGORY = category.id;

        const lobbyRepository = LobbyRepository.getInstance();
        lobbyModel.ID = await lobbyRepository.create(lobbyModel);

        return lobbyModel;
    }

    public async generateMemberList(lobby: LobbyModel): Promise<MessageEmbed> {
        const userRepository = UserRepository.getInstance();
        const users = await userRepository.findAllUsersByLobby(lobby.ID);
        const embed = new MessageEmbed();
        embed.setTitle("Looking for at least 7 other users");
        embed.setColor('#ff861f');

        let body = "```";

        for (let user of users) {
            const fetched = await client.users.fetch(user.ID);
            body += `${fetched.username}\n`;
        }

        body += "```";

        embed.setDescription(body);

        return embed;
    }



    // async function sendJoinMessage(message: Message ,lobbyChannel: TextChannel) {
    //
    //     const embed = new MessageEmbed();
    //     embed.setTitle("You're all by yourself! Find at least 7 other users to start the match");
    //     embed.setDescription("```css\n" + `${message.author.username} (MatchLeader)\n` + "```");
    //     embed.setColor('#ff861f');
    //
    //
    //     const joinMessage = await lobbyChannel.send(embed);
    //     await joinMessage.pin();
    //     await lobbyChannel.bulkDelete(1);
    // }
    //
    // async function insertMatch(guildID: string, categoryID: string) {
    //     let [results]: any[] = await connection.execute(`INSERT INTO matches (GUILD_ID, CATEGORY_ID) VALUES (?, ?)`, [guildID, categoryID]);
    //     return results[0].insertId;
    // }
    //
    // await sendJoinMessage(this.message ,matchChannels.lobbyChannel!);
    // this.id = await insertMatch(matchCategory!.id, matchChannels.lobbyChannel!.id);
    // await this.addUser(this.message.author, true);

}

export default LobbyService;