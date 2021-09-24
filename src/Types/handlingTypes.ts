// @file: handlingTypes.ts
import { CommandInteraction } from 'discord.js';

export interface BotCommand {
	name: string;
	description: string;
	run: (interaction: CommandInteraction) => Promise<void>	
}

export interface BotEvent {
	block: boolean;
	run: ({ }) => Promise<void>;
}