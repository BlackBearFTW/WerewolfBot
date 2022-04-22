import { Collection } from "@discordjs/collection";
import ICommand from "./interfaces/CommandInterface";

class ApplicationCommandStorage extends Collection<ICommand, any> {
	private static instance: ApplicationCommandStorage;

	// eslint-disable-next-line no-useless-constructor
	private constructor() {
		super();
	}

	public static getInstance(): ApplicationCommandStorage {
		if (!ApplicationCommandStorage.instance) {
			ApplicationCommandStorage.instance = new ApplicationCommandStorage();
		}

		return ApplicationCommandStorage.instance;
	}
}

export default ApplicationCommandStorage;
