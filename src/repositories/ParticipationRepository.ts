import Singleton from "../decorators/Singleton";
import BaseRepository from "../abstracts/BaseRepository";
import ParticipationData from "../data/ParticipationData";

@Singleton
class ParticipationRepository extends BaseRepository {
	// eslint-disable-next-line no-useless-constructor
	constructor() {
		super();
	}

	//	Async findByInviteCode(code: string) {
	//		Return this.findBy(["invite_code"], [code]);
	//	}
	//
	//	Async findByCategory(category: CategoryChannel) {
	//		Return this.findBy(["category"], [category.id]);
	//	}
	//
	//	Private async findBy(where: string[], values: any[]) {
	//		Const whereClause = `${where.join(" = ? ")} = ? `;
	//		Const [results]: any[] = await this.connection.execute(`SELECT * FROM lobbies WHERE ${whereClause} LIMIT 1`, values);
	//
	//		If (results.length === 0) return null;
	//
	//		Const lobbyData = new LobbyData();
	//
	//		LobbyData.id = results[0].id;
	//		LobbyData.invite_code = results[0].invite_code;
	//		LobbyData.guild = results[0].guild;
	//		LobbyData.category = results[0].category;
	//		LobbyData.started = results[0].started;
	//		LobbyData.creation_date = results[0].creation_date;
	//
	//		Return lobbyData;
	//	}

	async create(participationData: ParticipationData) {
		try {
			await this.connection.execute("INSERT INTO participations(lobby_id, user_id, leader) VALUES (?, ?, ?)", [participationData.lobby_id, participationData.user_id, participationData.leader]);
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}

	async delete(participationData: ParticipationData) {
		try {
			await this.connection.execute("DELETE FROM participations WHERE lobby_id = ? AND user_id = ?", [participationData.lobby_id, participationData.user_id]);
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}

	async isLeader(participationData: ParticipationData) {
		const [results]: any[] = await this.connection.execute("SELECT * FROM participations WHERE lobby_id = ? AND user_id = ?", [participationData.lobby_id, participationData.user_id]);

		return results[0].leader === 1;
	}

	async inLobby(participationData: ParticipationData) {
		const [results]: any[] = await this.connection.execute("SELECT * FROM participations WHERE lobby_id = ? AND user_id = ?", [participationData.lobby_id, participationData.user_id]);

		return results.length > 0;
	}

	async update(participationData: ParticipationData) {
		const [results]: any[] = await this.connection.execute("UPDATE participations SET leader = ? WHERE lobby_id = ? AND user_id = ?", [participationData.leader, participationData.lobby_id, participationData.user_id]);

		return results.length > 0;
	}
}

export default ParticipationRepository;