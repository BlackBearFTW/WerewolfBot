import BaseRepository from "../abstracts/BaseRepository.js";
import UserModel from "../models/UserModel.js";

class UserRepository extends BaseRepository {
    private static instance: UserRepository;

    private constructor() {
        super();
    }

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }

        return UserRepository.instance;
    }

    public async create(user: UserModel): Promise<void> {
        await this.connection.execute("INSERT INTO users (ID, WIN_COUNT, LOSE_COUNT, DEATH_COUNT) VALUES (?, ?, ?, ?)", [user.ID, user.WIN_COUNT, user.LOSE_COUNT, user.DEATH_COUNT])
    }

    public async read(id: number): Promise<UserModel> {
        let [result]: any[] = await this.connection.execute("SELECT * FROM users WHERE ID = ?", [id]);
        const user = new UserModel();
        user.ID = result[0].ID;
        user.WIN_COUNT = result[0].WIN_COUNT;
        user.LOSE_COUNT = result[0].LOSE_COUNT;
        user.DEATH_COUNT = result[0].DEATH_COUNT;

        return user;
    }

    public async update(user: UserModel): Promise<void> {
       await this.connection.execute("UPDATE users SET WIN_COUNT = ?, LOSE_COUNT = ?, DEATH_COUNT = ? WHERE ID = ?", [user.WIN_COUNT, user.LOSE_COUNT, user.DEATH_COUNT, user.ID]);
    }

    public async delete(user: UserModel): Promise<void> {
       await this.connection.execute("DELETE FROM users WHERE ID = ?", [user.ID]);
    }

    public async findAllUsersByLobby(id: number): Promise<UserModel[]> {
        const users: UserModel[] = []
        const [result]: any[] = await this.connection.execute("SELECT users.* FROM users JOIN lobbies_users ON users.ID = lobbies_users.USER_ID WHERE lobbies_users.LOBBY_ID = ?", [id]);

        for (let item of result) {
            const user = new UserModel();
            user.ID = item.ID;
            user.WIN_COUNT = item.WIN_COUNT;
            user.LOSE_COUNT = item.LOSE_COUNT;
            user.DEATH_COUNT = item.DEATH_COUNT;
            users.push(user);
        }

        return users;
    }
}

export default UserRepository