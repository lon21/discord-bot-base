import { Client, ClientOptions, Collection, GatewayIntentBits, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { BaseEvent, BaseSlashCommand } from './interfaces';
import { BaseButton } from './interfaces/baseButton';
import { BaseModal } from './interfaces/baseModal';

class Bot extends Client {

	commands = new Collection<string, BaseSlashCommand>();
	events = new Collection<string, BaseEvent>();
	buttons = new Collection<string, BaseButton>();
	modals = new Collection<string, BaseModal>();

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