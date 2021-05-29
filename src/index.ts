import {Client} from "discord.js";
import { config } from "dotenv";
import EventHandlersManager from "./managers/EventHandlersManager";
import { eventHandlersFolder } from "./config.json";

export const client = new Client();
new EventHandlersManager(eventHandlersFolder);

if (process.env.NODE_ENV !== "production") config({path: "../.env"});

client?.login(process.env.BOT_TOKEN);