import Singleton from "../decorators/Singleton";
import BaseRepository from "../abstracts/BaseRepository";
import RoleData from "../data/RoleData";

@Singleton
class RoleRepository extends BaseRepository {
	// eslint-disable-next-line no-useless-constructor
	constructor() {
		super();
	}

	async getById(id: string) {
		const [results]: any[] = await this.connection.execute("SELECT * FROM roles WHERE id = ?", [id]);
		const roleData = new RoleData();

		roleData.id = results[0].id;
		roleData.name = results[0].name;
		roleData.description = results[0].description;
		roleData.emote = results[0].emote;
		roleData.position = results[0].position;

		return roleData;
	}

	async getAll() {
		const [results]: any[] = await this.connection.execute("SELECT * FROM roles", []);
		const data: RoleData[] = [];

		for (const row of results) {
			const roleData = new RoleData();

			roleData.id = row.id;
			roleData.name = row.name;
			roleData.description = row.description;
			roleData.emote = row.emote;
			roleData.position = row.position;

			data.push(roleData);
		}

		return data;
	}
}

export default RoleRepository;