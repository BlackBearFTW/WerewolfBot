import Singleton from "../decorators/Singleton";
import BaseRepository from "../abstracts/BaseRepository";
import ParticipationData from "../data/ParticipationData";

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

	async getLeader(id: number) {
		const [results]: any[] = await this.connection.execute("SELECT * FROM participations WHERE lobby_id = ? AND leader = 1", [id]);

		if (!results.length) return null;

		const participationData = new ParticipationData();

		participationData.id = results[0].id;
		participationData.lobby_id = results[0].lobby_id;
		participationData.user_id = results[0].user_id;
		participationData.leader = results[0].leader;

		return participationData;
	}

	async isLeader(participationData: ParticipationData) {
		const [results]: any[] = await this.connection.execute("SELECT * FROM participations WHERE lobby_id = ? AND user_id = ?", [participationData.lobby_id, participationData.user_id]);

		if (!results.length) return false;

		return results[0].leader === 1;
	}

	async inLobby(participationData: ParticipationData) {
		const [results]: any[] = await this.connection.execute("SELECT * FROM participations WHERE lobby_id = ? AND user_id = ?", [participationData.lobby_id, participationData.user_id]);

		return results.length > 0;
	}
}

export default ParticipationRepository;