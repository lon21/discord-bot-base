import { ClientEvents} from 'discord.js';

export interface EventDecoratorOptions {
	name: keyof ClientEvents;
	once?: boolean;
}