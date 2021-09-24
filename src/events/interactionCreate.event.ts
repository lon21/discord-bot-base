import { CommandInteraction } from 'discord.js';
import { BotCommand, BotEvent } from '../Types/handlingTypes';
import bot from '../Structures/bot';

export default <BotEvent> {
	run: async (interaction: CommandInteraction) => {

		if (!interaction.isCommand()) return;

		const command: BotCommand = bot.commands.get(interaction.commandName);
		if (!command || typeof command === undefined) return;

		try {
		command.run(interaction);
		} catch (err) {
			console.error(err);
		}
	},
};