class RoleData {
	id: string | null
	name: string | null
	description: string | null
	emote: string | null
	position: number | null;

	constructor() {
		this.id = null;
		this.name = null;
		this.description = null;
		this.emote = null;
		this.position = null;
	}
}

export default RoleData;