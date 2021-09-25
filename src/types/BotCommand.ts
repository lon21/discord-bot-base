import { CommandInteraction } from 'discord.js';

export interface BotCommand {
	name: string;
	description: string;
	run: (interaction: CommandInteraction) => Promise<void>	
}