import {Client} from 'discord.js';
import EventsHandler from "./handlers/EventsHandler.js";

export const client = new Client();

new EventsHandler("./events");

client?.login(process.env.BOT_TOKEN);