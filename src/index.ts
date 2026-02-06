import { config } from 'dotenv';
import { Logger } from './utils/loggers';
import { loadEvents } from './handlers/eventHandler';
import bot from './bot';
import { loadCommands } from './handlers/commandHandlers';

console.clear();

Logger.info('Starting bot...');

config({ quiet: true });

(async () => {
	Logger.info('Starting to load events...');
	await loadEvents();

	Logger.info('Starting to load commands...');
	await loadCommands();

	bot.login(process.env.BOT_TOKEN);
})();