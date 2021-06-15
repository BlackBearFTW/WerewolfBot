import Singleton from "../decorators/Singleton";
import BaseRepository from "../abstracts/BaseRepository";
import ParticipationData from "../data/ParticipationData";
import {lobbySize} from "../config.json";

@Singleton
class ParticipationRepository extends BaseRepository {
	// eslint-disable-next-line no-useless-constructor
	constructor() {
		super();
	}

	async create(participationData: ParticipationData) {
		try {
			await this.connection.execute("INSERT INTO participations(lobby_id, user_id, leader) VALUES (?, ?, ?)", [participationData.lobby_id, participationData.user_id, participationData.leader]);
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}

	async update(participationData: ParticipationData) {
		const [results]: any[] = await this.connection.execute("UPDATE participations SET leader = ? WHERE lobby_id = ? AND user_id = ?", [participationData.leader, participationData.lobby_id, participationData.user_id]);

		return results.length > 0;
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

	async getLeader(lobbyID: number) {
		const [results]: any[] = await this.connection.execute("SELECT * FROM participations WHERE lobby_id = ? AND leader = 1", [lobbyID]);

		if (!results.length) return null;

		const participationData = new ParticipationData();

		participationData.id = results[0].id;
		participationData.lobby_id = results[0].lobby_id;
		participationData.user_id = results[0].user_id;
		participationData.role_id = results[0].role_id;
		participationData.leader = results[0].leader;

		return participationData;
	}

	async inLobby(participationData: ParticipationData) {
		const [results]: any[] = await this.connection.execute("SELECT * FROM participations WHERE lobby_id = ? AND user_id = ?", [participationData.lobby_id, participationData.user_id]);

		return results.length > 0;
	}

	async isMaxSize(participationData: ParticipationData) {
		const [results]: any[] = await this.connection.execute("SELECT * FROM participations WHERE lobby_id = ?", [participationData.lobby_id]);

		return results.length >= lobbySize.max;
	}

	async isMinSize(participationData: ParticipationData) {
		const [results]: any[] = await this.connection.execute("SELECT * FROM participations WHERE lobby_id = ?", [participationData.lobby_id]);

		return results.length >= lobbySize.min;
	}

	async getAllParticipants(lobbyID: number) {
		const [results]: any[] = await this.connection.execute("SELECT * FROM participations WHERE lobby_id = ?", [lobbyID]);
		const data: ParticipationData[] = [];

		for (const row of results) {
			const participationData = new ParticipationData();

			participationData.id = row.id;
			participationData.lobby_id = row.lobby_id;
			participationData.user_id = row.user_id;
			participationData.role_id = row.role_id;
			participationData.leader = row.leader;

			data.push(participationData);
		}

		return data;
	}

	async assignRole(participationData: ParticipationData) {
		try {
			await this.connection.execute("UPDATE participations SET role_id = ? WHERE lobby_id = ? AND user_id = ?", [participationData.role_id, participationData.lobby_id, participationData.user_id]);
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
}

export default ParticipationRepository;