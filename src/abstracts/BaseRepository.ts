import mysqlPromise from "mysql2/promise";

abstract class BaseRepository {
    protected connection: mysqlPromise.Pool;

    protected constructor() {
        this.connection = mysqlPromise.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
    }

    // Create default create, read, update, delete method here with given table.


}

export default BaseRepository;