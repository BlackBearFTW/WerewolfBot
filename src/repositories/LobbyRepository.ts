import Singleton from "../decorators/Singleton";
import BaseRepository from "../abstracts/BaseRepository";
import LobbyData from "../data/LobbyData";
import {CategoryChannel} from "discord.js";
import ErrorUtil from "../utils/ErrorUtil";

@Singleton
class LobbyRepository extends BaseRepository {
	// eslint-disable-next-line no-useless-constructor
	constructor() {
		super();
	}

	async findByInviteCode(code: string) {
		return this.findBy(["invite_code"], [code]);
	}

	async findByCategory(category: CategoryChannel) {
		return this.findBy(["category"], [category.id]);
	}

	async findById(id: number) {
		return this.findBy(["id"], [id]);
	}

	private async findBy(where: string[], values: any[]) {
		const whereClause = `${where.join(" = ? ")} = ? `;
		const [results]: any[] = await this.connection.execute(`SELECT * FROM lobbies WHERE ${whereClause} LIMIT 1`, values);

		if (results.length === 0) return null;

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
		try {
			await this.connection.execute("INSERT INTO lobbies(invite_code, guild, category) VALUES (?, ?, ?)", [lobbyData.invite_code, lobbyData.guild, lobbyData.category]);
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}

	async update(lobbyData: LobbyData) {
		const [results]: any[] = await this.connection.execute("UPDATE lobbies SET started = ? WHERE id = ?", [lobbyData.started, lobbyData.id]);

		return results.length > 0;
	}

	async delete(lobbyData: LobbyData) {
		const result = await ErrorUtil.handle(() => {
			this.connection.execute("DELETE FROM lobbies WHERE id = ?", [lobbyData.id]);
		});

		return result[0];
	}
}

export default LobbyRepository;