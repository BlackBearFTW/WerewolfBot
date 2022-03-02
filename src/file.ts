import Queue from "./types/Queue";
import {EntityManager, getConnection} from "typeorm";
import IRole from "./types/interfaces/RoleInterface";
import WerewolfRole from "./roles/WerewolfRole";
import queue from "./types/Queue";

function handleGame() {
	const queue = new Queue<string>();
	const context = getConnection().createEntityManager();

	queue.enqueue("werewolf");
	queue.enqueue("fortune teller");
	queue.enqueue("town folk");

	console.log("adding queue");

	console.log(handleGameTurn());

	const interval = setInterval(() => {
		handleGameTurn();

		if (queue.size === 0) clearInterval(interval);
	}, 30000);
}

function handleGameTurn() {
	const role = queue.dequeue();

	role.startTurn();
	setTimeout(() => role.endTurn(), 30000);
}

class GameHandler {
	private queue: Queue<IRole>;
	private context: EntityManager;

	constructor(lobbyId: string) {
		this.context = getConnection().createEntityManager();
		this.queue = new Queue<IRole>();
		this.queue.enqueue(new WerewolfRole(this.context, lobbyId));
		// Add more roles
	}

	public handle() {

	}
}