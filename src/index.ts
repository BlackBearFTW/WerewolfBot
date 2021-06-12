import {Client} from "discord.js";
import { config } from "dotenv";
import EventHandlersManager from "./managers/EventHandlersManager";
import { eventHandlersFolder } from "./config.json";
import path from "path";

export const client = new Client();
new EventHandlersManager(path.join(__dirname, eventHandlersFolder));

if (process.env.NODE_ENV !== "production") config();

client.login(process.env.BOT_TOKEN);
