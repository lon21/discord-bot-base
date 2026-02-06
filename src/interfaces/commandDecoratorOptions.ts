import { PermissionFlagsBits } from 'discord.js';

export type OptionType = 'USER' | 'BOOLEAN' | 'CHANNEL' | 'NUMBER' | 'INTEGER' | 'ROLE' | 'STRING' | 'ATTACHMENT' | 'MENTIONABLE';

export interface Choice {
	name: string;
	value: string | number;
}

export interface CommandOption {
	type: OptionType;
	name: string;
	description: string;
	required?: boolean;
	choices?: Choice[];
	minValue?: number;
	maxValue?: number;
	minLength?: number;
	maxLength?: number;
	autocomplete?: boolean;
}

export interface SubCommand {
	name: string;
	description: string;
	options?: CommandOption[];
}

export interface CommandDecoratorOptions {
	name: string;
	description: string;
	permissions?: keyof typeof PermissionFlagsBits;
	ownerOnly?: boolean;
	options?: CommandOption[];
	subCommands?: SubCommand[];
}