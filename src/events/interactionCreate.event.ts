import { Interaction, MessageFlags } from 'discord.js';
import { BaseEvent } from '../interfaces';
import bot from '../bot';
import { RegisterEvent, getCommandMetadata } from '../decorators';
import { Logger } from '../utils/loggers';

const getOwners = (): string[] => {
	try {
		return JSON.parse(process.env.OWNERS || '[]');
	} catch {
		Logger.error('Failed to parse OWNERS env variable');
		return [];
	}
};

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

			const options = getCommandMetadata(command.constructor);
			if (options?.ownerOnly) {
				const owners = getOwners();
				if (!owners.includes(interaction.user.id)) {
					Logger.debug(`User ${interaction.user.id} tried to use owner-only command: ${interaction.commandName}`);
					await interaction.reply({ content: '❌ This command is restricted to bot owners only.', flags: MessageFlags.Ephemeral });
					return;
				}
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

		if (interaction.isButton()) {
			const button = bot.buttons.get(interaction.customId);
			if (!button) {
				Logger.debug(`Button not found: ${interaction.customId}`);
				await interaction.reply({ content: '❌ Button not found.', flags: MessageFlags.Ephemeral });
				return;
			}

			try {
				await button.run(interaction);
			} catch (error) {
				Logger.error(`Error executing button ${interaction.customId}:`, error);
				
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: '❌ An error occurred while executing this button.', flags: MessageFlags.Ephemeral }).catch(() => {});
				} else {
					await interaction.reply({ content: '❌ An error occurred while executing this button.', flags: MessageFlags.Ephemeral }).catch(() => {});
				}
			}
		}
	}
}