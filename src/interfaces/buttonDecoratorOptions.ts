import { APIMessageComponentEmoji, ButtonStyle } from 'discord.js';

export interface ButtonDecoratorOptions {
	id: string;
	label: string;
	style: Exclude<ButtonStyle, ButtonStyle.Link>;
	disabled?: boolean;
	emoji?: string | APIMessageComponentEmoji;
}