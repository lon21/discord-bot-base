import { Client, Collection, Intents } from 'discord.js';

class client extends Client {

	commands: Collection<string, object>;
	events: Collection<string, object>;

	constructor(clientOptions) {
		super(clientOptions);
	
		this.commands = new Collection();
		this.events = new Collection();

		this.login(process.env.BOT_TOKEN);
	}	
}

const bot = new client({ intents: [Intents.FLAGS.GUILDS] });
export default bot;