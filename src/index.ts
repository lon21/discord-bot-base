import { config } from 'dotenv';
config();
import bot from './bot';
import Handler from './handler';

const handler = new Handler();

(async () => {
	await handler.loadEvents();
	await handler.loadCommands();
})();