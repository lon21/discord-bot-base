import { CommandInteraction } from 'discord.js';
import { command as commandInterface } from '../Types/handlingTypes';
import bot from '../Structures/bot';

export default {
	run: async (interaction: CommandInteraction) => {

		if (!interaction.isCommand()) return;

		const command: any = bot.commands.get(interaction.commandName);
		if (!command || typeof command === undefined) return;

		try {
		command.run(interaction);
		} catch (err) {
			console.error(err);
		}
	},
};