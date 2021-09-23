import { config } from 'dotenv';
config();
import bot from './Structures/bot';
import Handler from './Structures/handler';

const handler = new Handler();

(async () => {
	await handler.loadEvents();
	await handler.loadCommands();
})();