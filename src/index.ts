import "reflect-metadata";
import {Client} from "discord.js";
import { config } from "dotenv";
import EventHandlersContainer from "./containers/EventHandlersContainer";
import {createConnection} from "typeorm";
import DiscordUtil from "./utils/DiscordUtil";

const client = new Client({intents: DiscordUtil.getAllIntents()});

DiscordUtil.setClient(client);
new EventHandlersContainer().runSetup();

if (process.env.NODE_ENV !== "production") config();

// Config in ormconfig.json
createConnection();

client.login(process.env.BOT_TOKEN);
