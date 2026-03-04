import { Logger } from './utils/loggers';
import { loadEvents } from './handlers/eventHandler';
import bot from './bot';
import { loadCommands } from './handlers/commandHandler';
import { loadButtons } from './handlers/buttonHandler';
import { loadModals } from './handlers/modalHandler';

console.clear();

Logger.info('Starting bot...');

(async () => {
	Logger.info('Starting to load events...');
	await loadEvents();

	Logger.info('Starting to load buttons...');
	await loadButtons();

	Logger.info('Starting to load modals...');
	await loadModals();

	Logger.info('Starting to load commands...');
	await loadCommands();

	bot.login(Bun.env.BOT_TOKEN);
})();