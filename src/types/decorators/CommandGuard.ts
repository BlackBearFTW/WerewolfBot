import {CommandInteraction, MessageEmbed} from "discord.js";
import ICommand from "../interfaces/CommandInterface";
import GuardMethodInterface from "../interfaces/GuardMethodInterface";

function CommandGuard(guards: GuardMethodInterface[]) {
	return function<T extends new(...args: {}[]) => ICommand>(target: T) {
		const originalFunc = target.prototype.onInteraction;

		target.prototype.onInteraction = function(interaction: CommandInteraction) {
			function onFail(title: string, description: string, ephemeral = true) {
				const embed = new MessageEmbed({
					title,
					description,
					color: "RED"
				});

				interaction.reply({embeds: [embed], ephemeral});
			}

			function runNext(this: any, index: number, arr: Function[]) {
				if (arr.length === 0) return originalFunc(interaction);

				if (arr.length - 1 === index) {
					// Binds the original function the guard was placed on, if this is the last item in the array.
					arr[index](interaction, originalFunc.bind(this, interaction), onFail);
				} else if (index === 0) {
					// This starts of the guard by calling the first element in the array, while also binding the next element in the array.
					arr[index].call(this, interaction, runNext.bind(this, index + 1, arr), onFail);
				} else {
					// Simply calls the next guard, while also binding the guard after that to the next parameter.
					arr[index](interaction, runNext.bind(this, index + 1, arr), onFail);
				}
			}

			runNext(0, guards);
		};
	};
}

export default CommandGuard;
