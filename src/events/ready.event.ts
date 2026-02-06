import { Client } from 'discord.js';
import { BaseEvent } from '../interfaces';
import { RegisterEvent } from '../decorators';
import { Logger } from '../utils/loggers';
import bot from '../bot';

@RegisterEvent({
	name: 'clientReady',
	once: true
})
export class ReadyEvent extends BaseEvent {
	async run(client: Client) {
		Logger.success(`Logged in as ${client.user?.tag}!`);
		// @ts-ignore
		global.bot = bot;
	}
}