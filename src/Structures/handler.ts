import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { readdirSync } from 'fs';
import { Event as eventInterface, Command as commandInterface } from '../Types/handlingTypes';
import bot from './bot';

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

export default class Handler {

	loadEvents: () => void;
	loadCommands: () => void;
	loadSlashCommands: (string, object) => void;

	constructor(handlerOptions?) {

		this.loadEvents = () => {
			readdirSync(`${__dirname}/../events`).forEach((fileName: string) => {
				if (fileName.startsWith('--') || !fileName.includes('event')) return;

				const event: eventInterface = require(`../events/${fileName}`).default;
				const eventName: string = fileName.split('.')[0];
				bot.events.set(eventName, event);

				if (event.block) return;

				bot.on(eventName, (args) => event.run(args));
			});
		};

		this.loadCommands = async () => {
			await readdirSync(`${__dirname}/../commands`).forEach((fileName: string) => {
				if (fileName.startsWith('--') || !fileName.includes('command')) return;

				const command: commandInterface = require(`../commands/${fileName}`).default;
				if (!command.name || !command.description || !command.run) {
					if (process.env.NODE_ENV === 'development') return console.error(`File: ${fileName} doesn't have a name or description or run option!`);
					else return;
				}

				bot.commands.set(command.name, command);
			});
		};

		this.loadSlashCommands = async (id, guilds) => {

			let commands = [];
			await bot.commands.forEach((command: commandInterface) => {
				const toAdd = {
					name: command.name,
					description: command.description,
				};
				commands.push(toAdd);
			});

			await (async () => {
					console.log('Started loading (/) commands');
					let gLength = 0;

					await guilds.forEach(async g => {
						try {
							await rest.put(
								Routes.applicationGuildCommands(id, g.id),
								{ body: commands },
							);
						} catch (error) {
							console.error(error);
						}
						
						console.log(`Loaded for ${g.name}`);
						gLength++;
						
						if (gLength === guilds.size) {
							console.log('Finished loading (/) commands');
							return bot.emit('readyToUse');
						}
					});
			})();
		};
	}
}