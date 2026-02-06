import { ChatInputCommandInteraction } from 'discord.js';

export abstract class BaseSlashCommand {
	abstract run(interaction: ChatInputCommandInteraction): Promise<any>;
}