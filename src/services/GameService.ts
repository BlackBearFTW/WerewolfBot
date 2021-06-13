import Singleton from "../decorators/Singleton";
import {Message} from "discord.js";

@Singleton
class GameService {
	async setupGame(message: Message) {

	}
}

export default GameService;