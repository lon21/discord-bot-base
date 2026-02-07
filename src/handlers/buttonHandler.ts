import { readdirSync } from 'fs'
import path from 'path'
import { getButtonMetadata } from '../decorators';
import bot from '../bot';
import { Logger } from '../utils/loggers';
import { BaseButton } from '../interfaces';
import { ButtonBuilder } from 'discord.js';

export const loadButtons = async () => {
	const files = readdirSync(path.join(__dirname, '..', 'buttons')).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
	for (const file of files) {
		const fileImport = await import(path.join(__dirname, '..', 'buttons', file));
		
		for (const exportedClass of Object.values(fileImport)) {
			if (typeof exportedClass !== 'function') continue;

			const meta = getButtonMetadata(exportedClass);
			
			if (!meta) {
				Logger.error(`No button metadata found for class in file ${file}`);
				continue;
			}

			const buttonInstance = new (exportedClass as new () => BaseButton)();

			const buttonDiscordData = new ButtonBuilder()
				.setCustomId(meta.id)
				.setLabel(meta.label)
				.setStyle(meta.style);

			if (meta.disabled) buttonDiscordData.setDisabled(true);
			if (meta.emoji) buttonDiscordData.setEmoji(meta.emoji);

			buttonInstance.discordData = buttonDiscordData;
			
			bot.buttons.set(meta.id, buttonInstance);

			Logger.info(`Loaded button: ${meta.id} from file: ${file}`);
		}
	}

	Logger.success(`Loaded a total of ${bot.buttons.size} buttons.`);
}