import ApplicationCommandStorage from "../ApplicationCommandStorage";
import {ApplicationCommandData, ApplicationCommandOptionType} from "discord.js";

function SlashOption(
	name: string,
	description: string,
	options: { required?: boolean; type?: ApplicationCommandOptionType; choices?: string[]} = {required: false, type: "STRING" }
) {
	return function(target: any) {
		const metaStorage = ApplicationCommandStorage.getInstance();

		const cmdData = metaStorage.get(target) ?? {} as ApplicationCommandData;

		if (!cmdData.options) cmdData.options = [];

		cmdData.options = [...cmdData.options, { name, description, ...options }].reverse();

		metaStorage.set(target, cmdData);

		return target;
	};
}

export default SlashOption;
