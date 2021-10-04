import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { readdirSync } from 'fs';
import { BotEvent as eventInterface, BotCommand as commandInterface } from './types';
import { join } from 'path';
import bot from './bot';

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

export default class Handler {

	loadEvents: () => void;
	loadCommands: () => void;
	loadSlashCommands: (string, object) => void;

	constructor(handlerOptions?) {

		this.loadEvents = () => {
			readdirSync(join(__dirname, 'events')).forEach((fileName: string) => {
				if (fileName.startsWith('--') || !fileName.includes('event')) return;
				const event: eventInterface = require(`./events/${fileName}`).default;
				const eventName: string = fileName.split('.')[0];
				bot.events.set(eventName, event);

				if (event.block) return;

				bot.on(eventName, (args) => event.run(args));
			});
		};

		this.loadCommands = async () => {
			await readdirSync(join(__dirname, 'commands')).forEach((fileName: string) => {
				if (fileName.startsWith('--') || !fileName.includes('command')) return;

				const command: commandInterface = require(`./commands/${fileName}`).default;
				if (!command.name || !command.description || !command.run) {
					if (process.env.NODE_ENV === 'development') return console.error(`File: ${fileName} doesn't have a name or description or run option!`);
					else return;
				}

				bot.commands.set(command.name, command);
			});
		};

		this.loadSlashCommands = async (id, guilds) => {

			console.log('Started loading (/) commands');

			let commands = [];
			await bot.commands.forEach((command: commandInterface) => {
				const toAdd = {
					name: command.name,
					description: command.description,
				};
				if (command?.options) {
					toAdd['options'] = command.options;
				}
				commands.push(toAdd);
			});

			let guildsSize = 0;
			guilds.forEach(g => {
				try {
					rest.put(
						Routes.applicationGuildCommands(id, g.id),
						{ body: commands },
					);
				} catch (error) {
					console.error(error);
				}
				console.log(`Loaded for ${g.name}`);


				guildsSize++;
				if (guildsSize === guilds.size) {
					console.log('Finished loading (/) commands');
					return bot.emit('readyToUse');
				}
			});
		};
	}
}