import { readdirSync } from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { getEventMetadata } from '../decorators';
import bot from '../bot';
import { Logger } from '../utils/loggers';
import { BaseEvent } from '../interfaces';

export const loadEvents = async () => {
	const files = readdirSync(path.join(__dirname, '..', 'events')).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
	for (const file of files) {
		const filePath = path.join(__dirname, '..', 'events', file);
		const fileImport = await import(pathToFileURL(filePath).href);
		
		for (const exportedClass of Object.values(fileImport)) {
			if (typeof exportedClass !== 'function') continue;

			const meta = getEventMetadata(exportedClass);
			
			if (!meta) {
				Logger.error(`No event metadata found for class in file ${file}`);
				continue;
			}

			const eventInstance = new (exportedClass as new () => BaseEvent)();

			if (meta.once) {
				bot.once(meta.name, (...args: any[]) => eventInstance.run(...args));
			} else {
				bot.on(meta.name, (...args: any[]) => eventInstance.run(...args));
			}
			
			bot.events.set(meta.name, eventInstance)

			Logger.info(`Loaded event: ${meta.name} from file: ${file}`);
		}
	}

	Logger.success(`Loaded a total of ${bot.events.size} events.`);
}