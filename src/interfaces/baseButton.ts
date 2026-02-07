import { ButtonBuilder, ButtonInteraction } from 'discord.js';

export abstract class BaseButton {
	abstract run(interaction: ButtonInteraction): Promise<void>;

	discordData: ButtonBuilder;
}