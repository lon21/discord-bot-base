import { readdirSync } from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { getCommandMetadata } from '../decorators';
import bot from '../bot';
import { Logger } from '../utils/loggers';
import { BaseSlashCommand, CommandOption } from '../interfaces';
import {
	InteractionContextType,
	PermissionFlagsBits,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from 'discord.js';

export const loadCommands = async () => {
	const commandsPath = path.join(__dirname, '..', 'commands');
	const files = readdirSync(commandsPath).filter(file =>
		file.endsWith('.command.ts') || file.endsWith('.command.js')
	);

	const addOptions = (builder: SlashCommandBuilder | SlashCommandSubcommandBuilder, options: CommandOption[]) => {
		for (const option of options) {
			const { name, description, required = false, choices, minValue, maxValue, minLength, maxLength, autocomplete } = option;

			switch (option.type) {
				case 'STRING': {
					builder.addStringOption(opt => {
						opt.setName(name).setDescription(description).setRequired(required);
						if (choices?.length) opt.addChoices(...choices.map(c => ({ name: c.name, value: String(c.value) })));
						if (minLength !== undefined) opt.setMinLength(minLength);
						if (maxLength !== undefined) opt.setMaxLength(maxLength);
						if (autocomplete) opt.setAutocomplete(autocomplete);
						return opt;
					});
					break;
				}
				case 'INTEGER': {
					builder.addIntegerOption(opt => {
						opt.setName(name).setDescription(description).setRequired(required);
						if (choices?.length) opt.addChoices(...choices.map(c => ({ name: c.name, value: Number(c.value) })));
						if (minValue !== undefined) opt.setMinValue(minValue);
						if (maxValue !== undefined) opt.setMaxValue(maxValue);
						if (autocomplete) opt.setAutocomplete(autocomplete);
						return opt;
					});
					break;
				}
				case 'NUMBER': {
					builder.addNumberOption(opt => {
						opt.setName(name).setDescription(description).setRequired(required);
						if (choices?.length) opt.addChoices(...choices.map(c => ({ name: c.name, value: Number(c.value) })));
						if (minValue !== undefined) opt.setMinValue(minValue);
						if (maxValue !== undefined) opt.setMaxValue(maxValue);
						if (autocomplete) opt.setAutocomplete(autocomplete);
						return opt;
					});
					break;
				}
				case 'BOOLEAN': {
					builder.addBooleanOption(opt => opt.setName(name).setDescription(description).setRequired(required));
					break;
				}
				case 'USER': {
					builder.addUserOption(opt => opt.setName(name).setDescription(description).setRequired(required));
					break;
				}
				case 'CHANNEL': {
					builder.addChannelOption(opt => opt.setName(name).setDescription(description).setRequired(required));
					break;
				}
				case 'ROLE': {
					builder.addRoleOption(opt => opt.setName(name).setDescription(description).setRequired(required));
					break;
				}
				case 'ATTACHMENT': {
					builder.addAttachmentOption(opt => opt.setName(name).setDescription(description).setRequired(required));
					break;
				}
				case 'MENTIONABLE': {
					builder.addMentionableOption(opt => opt.setName(name).setDescription(description).setRequired(required));
					break;
				}
				default: {
					Logger.error(`Unknown option type: ${option.type} for option ${name}`);
					break;
				}
			}
		}
	};

	for (const file of files) {
		try {
			const filePath = path.join(commandsPath, file);
			const fileImport = await import(pathToFileURL(filePath).href);

			for (const exportedClass of Object.values(fileImport)) {
				if (typeof exportedClass !== 'function') continue;

				const meta = getCommandMetadata(exportedClass);

				if (!meta) continue;

				if (!meta.name || !meta.description) {
					Logger.error(`Command in ${file} is missing required name or description`);
					continue;
				}

				const commandInstance = new (exportedClass as new () => BaseSlashCommand)();

				const slashCommandData = new SlashCommandBuilder()
					.setName(meta.name)
					.setDescription(meta.description)
					.setContexts(InteractionContextType.Guild);

				if (meta.permissions) {
					const permissionValue = PermissionFlagsBits[meta.permissions];
					if (permissionValue !== undefined) {
						slashCommandData.setDefaultMemberPermissions(permissionValue);
					} else {
						Logger.error(`Invalid permission "${meta.permissions}" for command ${meta.name}`);
					}
				}

				if (meta.options?.length && !meta.subCommands?.length) {
					addOptions(slashCommandData, meta.options);
				}

				if (meta.subCommands?.length) {
					for (const subCommand of meta.subCommands) {
						if (!subCommand.name || !subCommand.description) {
							Logger.error(`Subcommand in ${meta.name} is missing required name or description`);
							continue;
						}

						slashCommandData.addSubcommand(subCmd => {
							subCmd.setName(subCommand.name).setDescription(subCommand.description);
							if (subCommand.options?.length) addOptions(subCmd, subCommand.options);
							return subCmd;
						});
					}
				}

				bot.commands.set(meta.name, commandInstance);
				bot.slashCommandsData.push(slashCommandData.toJSON());
				Logger.info(`Loaded command: ${meta.name}`);
			}
		} catch (error) {
			Logger.error(`Failed to load command file ${file}: ${error}`);
		}
	}

	Logger.success(`Loaded a total of ${bot.commands.size} commands.`);
	Logger.info('Registering slash commands with Discord...');

	const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

	const discordApiRequest = async (route: string, method: string, body?: any): Promise<any> => {
		const url = `https://discord.com/api/v10${route}`;
		const response = await fetch(url, {
			method,
			headers: {
				'Authorization': `Bot ${process.env.BOT_TOKEN}`,
				'Content-Type': 'application/json',
			},
			body: body ? JSON.stringify(body) : undefined,
		});

		if (response.status === 429) {
			const rateLimitData = await response.json() as { retry_after?: number };
			const retryAfter = Math.ceil((rateLimitData.retry_after || 5) + 10); // Add 10 seconds buffer
			const retryTime = new Date(Date.now() + retryAfter * 1000).toLocaleTimeString();
			Logger.warn(`Rate limited. Waiting ${retryAfter} seconds (will retry at ${retryTime})...`);
			await delay(retryAfter * 1000);
			return discordApiRequest(route, method, body);
		}

		if (!response.ok) {
			const error = await response.json();
			throw new Error(`Discord API error: ${response.status} - ${JSON.stringify(error)}`);
		}

		return response.json();
	};

	try {
		Logger.debug(`Commands to register: ${JSON.stringify(bot.slashCommandsData.map(c => c.name))}`);
		Logger.debug(`BOT_APP_ID: ${process.env.BOT_APP_ID}`);
		Logger.debug(`COMMAND_GUILD_ID: ${process.env.COMMAND_GUILD_ID}`);

		const globalCommands = (process.env.GLOBAL_COMMANDS ?? 'false').toLowerCase() === 'true';
		if (!globalCommands) {
			if (!process.env.COMMAND_GUILD_ID) {
				Logger.error('COMMAND_GUILD_ID is not set in .env but GLOBAL_COMMANDS is false. Cannot register guild-specific commands.');
				process.exit(1);
			}

			const route = `/applications/${process.env.BOT_APP_ID}/guilds/${process.env.COMMAND_GUILD_ID}/commands`;

			Logger.debug('Registering guild commands...');
			const result = await discordApiRequest(route, 'PUT', bot.slashCommandsData);
			Logger.debug(`Registration result: Registered ${Array.isArray(result) ? result.length : 0} commands`);
			Logger.success(`Registered commands to guild ID ${process.env.COMMAND_GUILD_ID}`);
		} else {
			const route = `/applications/${process.env.BOT_APP_ID}/commands`;

			Logger.debug('Registering global commands...');
			await discordApiRequest(route, 'PUT', bot.slashCommandsData);
			Logger.success('Registered global commands');
		}
	} catch (error: any) {
		Logger.error(`Failed to register slash commands: ${error}`);
	}
}