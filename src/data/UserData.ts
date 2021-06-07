class UserData {
	id: string | null
	wins: number | null
	losses: number | null
	deaths: number | null
	as_werewolf: number | null;

	constructor() {
		this.id = null;
		this.wins = null;
		this.losses = null;
		this.deaths = null;
		this.as_werewolf = null;
	}
}

export default UserData;