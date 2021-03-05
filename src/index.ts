import {Client} from 'discord.js';
import mysqlPromise from "mysql2/promise.js";
import EventsHandler from "./handlers/EventsHandler.js";

export const client = new Client();

export const connection = mysqlPromise.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

new EventsHandler("./events");

client?.login(process.env.BOT_TOKEN);