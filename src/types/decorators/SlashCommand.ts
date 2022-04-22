import ApplicationCommandStorage from "../ApplicationCommandStorage";

function SlashCommand(name: string, description: string) {
	return function(target: any) {
		const metaStorage = ApplicationCommandStorage.getInstance();
		const cmdData = metaStorage.get(target) ?? {};

		metaStorage.set(
			target,
			Object.assign(cmdData, {
				name,
				description,
				target: target
			})
		);

		return target;
	};
}

export default SlashCommand;
