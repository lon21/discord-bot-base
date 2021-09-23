import { CommandInteraction } from 'discord.js';

interface commandInput {
	interaction: CommandInteraction;
}

export interface command {
	name: string;
	description: string;
	run: (commandInput) => Promise<void>	
}

export interface event {
	block: boolean;
	run: ({ }) => Promise<void>;
}