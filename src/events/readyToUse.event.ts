import bot from '../Structures/bot';

export = {
	run: async () => {
		console.log(`Logged in as ${bot.user.tag}`);
	}
}