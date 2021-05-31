class LobbyData {
	id: number | null
	invite_code: string | null
	guild: string | null
	category: string | null
	started: boolean | null
	creation_date: Date | null

	constructor() {
		this.id = null;
		this.invite_code = null;
		this.guild = null;
		this.category = null;
		this.started = null;
		this.creation_date = null;
	}
}

export default LobbyData;