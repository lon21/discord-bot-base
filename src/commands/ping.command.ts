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
		
		await interaction.reply('Getting info...');
		
		const msg = await interaction.fetchReply();
		
		await interaction.editReply(`Pong!\n> **API roundtrip ping:** \`${msg.createdTimestamp - interaction.createdTimestamp}ms\`\n> **Bot's WebSocket ping:** \`${bot.ws.ping}ms\``);
	}
}