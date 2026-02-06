import { Interaction, MessageFlags } from 'discord.js';
import { BaseEvent } from '../interfaces';
import bot from '../bot';
import { RegisterEvent } from '../decorators';
import { Logger } from '../utils/loggers';

@RegisterEvent({
	name: 'interactionCreate',
})
export class InteractionCreateEvent extends BaseEvent {
	async run(interaction: Interaction) {
		if (interaction.isChatInputCommand()) {
			const receivedAt = Date.now();
			Logger.debug(`Received command: ${interaction.commandName} at ${receivedAt}`);
			
			const command = bot.commands.get(interaction.commandName);

			if (!command) {
				Logger.debug(`Command not found: ${interaction.commandName}`);
				await interaction.reply({ content: '❌ Command not found.', flags: MessageFlags.Ephemeral });
				return;
			}
			
			Logger.debug(`Found command handler, executing... (${Date.now() - receivedAt}ms since received)`);
			
			try {
				await command.run(interaction);
				Logger.debug(`Command ${interaction.commandName} completed in ${Date.now() - receivedAt}ms`);
			} catch (error) {
				Logger.error(`Error executing command ${interaction.commandName}:`, error);
				
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: '❌ An error occurred while executing this command.', flags: MessageFlags.Ephemeral }).catch(() => {});
				} else {
					await interaction.reply({ content: '❌ An error occurred while executing this command.', flags: MessageFlags.Ephemeral }).catch(() => {});
				}
			}
		}
	}
}