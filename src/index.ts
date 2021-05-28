import {Client} from "discord.js";
import { config as env } from "dotenv";
import EventHandlersManager from "./managers/EventHandlersManager";

export const client = new Client();
new EventHandlersManager("./events");

if (process.env.NODE_ENV !== "production") env({path: "../.env"});

client?.login(process.env.BOT_TOKEN);