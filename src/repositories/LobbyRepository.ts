import BaseRepository from "../abstracts/BaseRepository";
import LobbyModel from "../models/LobbyModel";

class LobbyRepository extends BaseRepository {
    private static instance: LobbyRepository;

    private constructor() {
        super();
    }

    public static getInstance(): LobbyRepository {
        if (!LobbyRepository.instance) {
            LobbyRepository.instance = new LobbyRepository();
        }

        return LobbyRepository.instance;
    }

    public async create(lobby: LobbyModel): Promise<number> {
       const [result]: any[] = await this.connection.execute("INSERT INTO lobbies (GUILD, CATEGORY, STARTED) VALUES (?, ?, ?)", [lobby.GUILD, lobby.CATEGORY, lobby.STARTED]);
        return result.insertId;
    }

    public async read(id: number): Promise<LobbyModel> {
        let [result]: any[] = await this.connection.execute("SELECT * FROM lobbies WHERE ID = ?", [id]);
        const lobby = new LobbyModel();
        lobby.ID = result[0].ID;
        lobby.GUILD = result[0].GUILD;
        lobby.CATEGORY = result[0].CATEGORY;
        lobby.STARTED = (result[0].STARTED == 1);
        lobby.CREATION_DATE = result[0].CREATION_DATE;

        return lobby;
    }

    public async update(lobby: LobbyModel): Promise<void> {
        await this.connection.execute("UPDATE lobbies SET GUILD = ?, CATEGORY = ?, STARTED = ? WHERE ID = ?", [lobby.GUILD, lobby.CATEGORY, lobby.STARTED, lobby.ID]);
    }

    public async delete(lobby: LobbyModel): Promise<void> {
        await this.connection.execute("DELETE FROM lobbies WHERE ID = ?", [lobby.ID]);
    }

}

export default LobbyRepository;