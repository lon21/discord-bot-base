import { Client, ClientOptions, Collection, GatewayIntentBits, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { BaseEvent, BaseSlashCommand } from './interfaces';
import { BaseButton } from './interfaces/baseButton';

class Bot extends Client {

	commands = new Collection<string, BaseSlashCommand>();
	events = new Collection<string, BaseEvent>();
	buttons = new Collection<string, BaseButton>();

	slashCommandsData: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

	constructor(options: ClientOptions) {
		super(options);
	}
}

const bot = new Bot({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	]
});
export default bot;