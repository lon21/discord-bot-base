import { ActionRowBuilder, ButtonBuilder, CommandInteraction } from 'discord.js';
import { RegisterCommand } from '../decorators';
import { BaseSlashCommand } from '../interfaces';
import bot from '../bot';

@RegisterCommand({
	name: 'button',
	description: 'A command to test buttons',
	ownerOnly: true,
})
export class ButtonCommand extends BaseSlashCommand {
	async run(interaction: CommandInteraction) {
		const button = bot.buttons.get('testButton');
		if (!button) {
			await interaction.reply({ content: 'Button not found!', ephemeral: true });
			return;
		}

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button.discordData);
		interaction.reply({ content: 'Click a button', components: [row] })
	}
}