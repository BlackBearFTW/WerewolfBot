class ParticipationData {
	id: number | null
	lobby_id: number | null
	user_id: string | null
	leader: boolean | null

	constructor() {
		this.id = null;
		this.lobby_id = null;
		this.user_id = null;
		this.leader = null;
	}
}

export default ParticipationData;