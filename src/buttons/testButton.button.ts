import { ButtonInteraction, ButtonStyle } from 'discord.js';
import { BaseButton } from '../interfaces';
import { RegisterButton } from '../decorators';

@RegisterButton({
	id: 'testButton',
	label: 'Test Button',
	style: ButtonStyle.Primary,
	emoji: '✅',
})
export class TestButton extends BaseButton {
	async run(interaction: ButtonInteraction) {
		await interaction.reply('This is a test button!');
	}
}