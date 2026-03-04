import { readdirSync } from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { getModalMetadata } from '../decorators';
import bot from '../bot';
import { Logger } from '../utils/loggers';
import { BaseModal } from '../interfaces';

export const loadModals = async () => {
	const files = readdirSync(path.join(__dirname, '..', 'modals')).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
	for (const file of files) {
		const filePath = path.join(__dirname, '..', 'modals', file);
		const fileImport = await import(pathToFileURL(filePath).href);

		for (const exportedClass of Object.values(fileImport)) {
			if (typeof exportedClass !== 'function') continue;

			const meta = getModalMetadata(exportedClass);

			if (!meta) {
				Logger.error(`No modal metadata found for class in file ${file}`);
				continue;
			}

			const modalInstance = new (exportedClass as new () => BaseModal)();

			bot.modals.set(meta.id, modalInstance);

			Logger.info(`Loaded modal: ${meta.id} from file: ${file}`);
		}
	}

	Logger.success(`Loaded a total of ${bot.modals.size} modals.`);
}
