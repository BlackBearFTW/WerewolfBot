import {Client} from "discord.js";
import { config as env } from "dotenv";
import EventsHandler from "./handlers/EventsHandler";

export const client = new Client();
new EventsHandler("./events");

if (process.env.NODE_ENV !== "production") env({path: "../.env"});

client?.login(process.env.BOT_TOKEN);