import { ActionRowBuilder, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { RegisterCommand } from '../decorators';
import { BaseSlashCommand } from '../interfaces';

@RegisterCommand({
	name: 'modal',
	description: 'Opens a test modal',
	ownerOnly: true,
})
export class ModalCommand extends BaseSlashCommand {
	async run(interaction: ChatInputCommandInteraction) {
		const modal = new ModalBuilder()
			.setCustomId('testModal')
			.setTitle('Test Modal');

		const nameInput = new TextInputBuilder()
			.setCustomId('nameInput')
			.setLabel('Your name')
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Enter your name...')
			.setRequired(true);

		const feedbackInput = new TextInputBuilder()
			.setCustomId('feedbackInput')
			.setLabel('Your feedback')
			.setStyle(TextInputStyle.Paragraph)
			.setPlaceholder('Enter your feedback...')
			.setRequired(true);

		const nameRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
		const feedbackRow = new ActionRowBuilder<TextInputBuilder>().addComponents(feedbackInput);

		modal.addComponents(nameRow, feedbackRow);

		await interaction.showModal(modal);
	}
}
