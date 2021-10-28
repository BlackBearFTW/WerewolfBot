import "reflect-metadata";
import {Client} from "discord.js";
import { config } from "dotenv";
// Import EventHandlersManager from "./managers/EventHandlersManager";
import {createConnection} from "typeorm";
import DiscordUtil from "./utils/DiscordUtil";

const client = new Client({intents: DiscordUtil.getAllIntents()});

DiscordUtil.setClient(client);
// New EventHandlersManager();

if (process.env.NODE_ENV !== "production") config();

createConnection({
	"type": "mysql",
	"host": process.env.DB_HOST,
	"port": 3306,
	"username": process.env.DB_USER,
	"password": process.env.DB_PASSWORD,
	"database": process.env.DB_NAME,
	"synchronize": true,
	"entities": [
		"src/models/*.ts"
	],
	"subscribers": [
		"src/subscribers/*.ts"
	],
	"migrations": [
		"src/migrations/*.ts"
	],
	"cli": {
		"entitiesDir": "src/models",
		"migrationsDir": "src/migrations",
		"subscribersDir": "src/subscribers"
	}
});

client.login(process.env.BOT_TOKEN);
