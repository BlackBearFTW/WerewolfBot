import Singleton from "../decorators/Singleton";
import BaseRepository from "../abstracts/BaseRepository";
import UserData from "../data/UserData";

@Singleton
class UserRepository extends BaseRepository {
	// eslint-disable-next-line no-useless-constructor
	constructor() {
		super();
	}

	async getById(id: string) {
		const [results]: any[] = await this.connection.execute("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);

		if (results.length === 0) return null;

		const userData = new UserData();

		userData.id = results[0].id;
		userData.wins = results[0].wins;
		userData.losses = results[0].losses;
		userData.deaths = results[0].deaths;
		userData.as_werewolf = results[0].as_werewolf;

		return userData;
	}

	async create(user: UserData) {
		try {
			if (await this.getById(user.id!) !== null) return false;

			await this.connection.execute("INSERT INTO users (id) VALUES (?)", [user.id]);
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
}

export default UserRepository;