import { ChatInputCommandInteraction } from 'discord.js';
import { BaseSlashCommand } from '../interfaces';
import { RegisterCommand } from '../decorators';
import bot from '../bot';

@RegisterCommand({
	name: 'ping',
	description: 'Shows bot\'s ping',
	ownerOnly: true,
})
export class PingCommand extends BaseSlashCommand {
	async run(interaction: ChatInputCommandInteraction) {
		
		await interaction.reply('Zbieram informacje...');
		
		const msg = await interaction.fetchReply();
		
		await interaction.editReply(`Pong!\n> **Api roadtrip ping:** \`${msg.createdTimestamp - interaction.createdTimestamp}ms\`\n> **Ping bota z ws:** \`${bot.ws.ping}ms\``);
	}
}