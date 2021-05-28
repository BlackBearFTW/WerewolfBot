import {Client} from 'discord.js';
import EventsHandler from "./handlers/EventsHandler";

export const client = new Client();

new EventsHandler("./events");

client?.login(process.env.BOT_TOKEN);