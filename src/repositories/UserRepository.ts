import Singleton from "../decorators/Singleton";
import BaseRepository from "../abstracts/BaseRepository";

// Class UserData {
// }

@Singleton
class UserRepository extends BaseRepository {
	// eslint-disable-next-line no-useless-constructor
	constructor() {
		super();
	}

	// Async create(user: UserData) {
	// 	// Const [results]: any[] = await this.connection.execute("INSERT INTO users", [user]);
	// }
}

export default UserRepository;