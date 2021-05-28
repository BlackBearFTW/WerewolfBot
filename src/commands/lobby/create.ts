import {Message} from "discord.js";
import {CommandInterface} from "../../interfaces/CommandInterface";
import {client} from "../../index";
import LobbyService from "../../services/LobbyService";

export const command: CommandInterface = {
    name: 'create',
    async execute(message: Message, args: string[]) {
       const lobbyService = LobbyService.getInstance();
       const lobby = await lobbyService.createLobby(message)
        await lobbyService.generateMemberList(lobby);
    }
};