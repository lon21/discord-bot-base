import { CommandInteraction } from 'discord.js';

export interface BotCommand {
	name: string;
	description: string;
	options?: object,
	run: (interaction: CommandInteraction, args: any[]) => Promise<void>	
}