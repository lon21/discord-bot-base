import { ModalSubmitInteraction, MessageFlags } from 'discord.js';
import { BaseModal } from '../interfaces';
import { RegisterModal } from '../decorators';

@RegisterModal({
	id: 'testModal',
})
export class TestModal extends BaseModal {
	async run(interaction: ModalSubmitInteraction) {
		const name = interaction.fields.getTextInputValue('nameInput');
		const feedback = interaction.fields.getTextInputValue('feedbackInput');

		await interaction.reply({
			content: `📝 **Modal Submission Received!**\n> **Name:** ${name}\n> **Feedback:** ${feedback}`,
			flags: MessageFlags.Ephemeral,
		});
	}
}
