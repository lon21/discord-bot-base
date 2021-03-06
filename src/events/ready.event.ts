import { BotEvent } from '../types';
import bot from '../bot';
import Handler from '../handler';
const handler = new Handler();

export default <BotEvent> {
	run: async () => {
		await handler.loadSlashCommands(bot.user.id, bot.guilds.cache);
		bot.user.setActivity(`Looking at ${bot.guilds.cache.size} servers`, { type: 'STREAMING', url: 'https://www.youtube.com/watch?v=5qap5aO4i9A' });
		setInterval(() => {
			bot.user.setActivity(`Looking at ${bot.guilds.cache.size} servers`, { type: 'STREAMING', url: 'https://www.youtube.com/watch?v=5qap5aO4i9A' });
		}, 15 * 1000);
	},
};