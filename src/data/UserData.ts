class UserData {
	id: string | null
	wins: number | null
	losses: number | null
	deaths: number | null

	constructor() {
		this.id = null;
		this.wins = null;
		this.losses = null;
		this.deaths = null;
	}
}

export default UserData;