import fs from "fs";
import {Collection} from "discord.js";
import {rolesFolder} from "../config.json";
import Singleton from "../types/decorators/Singleton";
import path from "path";
import BaseRole from "../abstracts/BaseRole";
import RolesEnum from "../types/enums/RolesEnum";

@Singleton
class RolesManager {
	private roles = new Collection<string, BaseRole>();

	async getRole(id: RolesEnum) {
		if (this.roles.size === 0) await this.loadRoleFiles();

		if (!this.roles.has(id.toLowerCase())) return;

		return this.roles.get(id.toLowerCase());
	}

	async getAllRoles() {
		if (this.roles.size === 0) await this.loadRoleFiles();

		return this.roles;
	}

	private async loadRoleFiles() {
		const rootFolder = path.join(__dirname, "../", rolesFolder);

		const roleFiles = fs.readdirSync(rootFolder).filter((file: string) => file.endsWith(".js") || file.endsWith(".ts"));

		for (const file of roleFiles) {
			const {default: Role} = await import(`${rootFolder}/${file}`);

			this.roles.set(new Role().getId().toLowerCase(), new Role());
		}
	}
}

export default RolesManager;
