import bot from '../Structures/bot';

export default {
	run: async () => {
		console.log(`Logged in as ${bot.user.tag}`);
	}
}