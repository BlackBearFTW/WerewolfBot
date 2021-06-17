import {Client} from "discord.js";
import { config } from "dotenv";
import EventHandlersManager from "./managers/EventHandlersManager";

export const client = new Client();
new EventHandlersManager();

if (process.env.NODE_ENV !== "production") config();

client.login(process.env.BOT_TOKEN);
