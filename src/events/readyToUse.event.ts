import { BotEvent } from '../types';
import bot from '../bot';

export default <BotEvent> {
	run: async () => {
		console.log(`Logged in as ${bot.user.tag}`);
	}
}