import Singleton from "../decorators/Singleton";
import BaseRepository from "../abstracts/BaseRepository";
import LobbyData from "../data/LobbyData";

@Singleton
class LobbyRepository extends BaseRepository {
	// eslint-disable-next-line no-useless-constructor
	constructor() {
		super();
	}

	async getByInviteCode(code: string) {
		const [results]: any[] = await this.connection.execute("SELECT * FROM lobbies WHERE invite_code = ? LIMIT 1", [code]);

		const lobbyData = new LobbyData();

		lobbyData.id = results[0].id;
		lobbyData.invite_code = results[0].invite_code;
		lobbyData.guild = results[0].guild;
		lobbyData.category = results[0].category;
		lobbyData.started = results[0].started;
		lobbyData.creation_date = results[0].creation_date;

		return lobbyData;
	}

	async create(lobbyData: LobbyData) {
		await this.connection.execute("INSERT INTO lobbies(invite_code, guild, category) VALUES (?, ?, ?)", [lobbyData.invite_code, lobbyData.guild, lobbyData.category]);
	}
}

export default LobbyRepository;