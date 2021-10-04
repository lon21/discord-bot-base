import { CommandInteraction } from 'discord.js';
import { BotCommand, BotEvent } from '../types';
import bot from '../bot';

export default <BotEvent> {
	run: async (interaction: CommandInteraction) => {

		if (!interaction.isCommand()) return;

		const command = <BotCommand> bot.commands.get(interaction.commandName);
		if (!command || typeof command === undefined) return;
	
		const args = [];

		interaction.options.data.forEach(option => {
			args.push({
				name: option.name,
				value: option.value,
			});
		});

		try {
		command.run(interaction, args);
		} catch (err) {
			console.error(err);
		}
	},
};