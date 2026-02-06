import { readdirSync } from 'fs'
import path from 'path'
import { getCommandMetadata } from '../decorators';
import bot from '../bot';
import { Logger } from '../utils/loggers';
import { BaseSlashCommand, CommandOption } from '../interfaces';
import { 
	InteractionContextType, 
	PermissionFlagsBits, 
	REST, 
	Routes, 
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
			const fileImport = await import(path.join(commandsPath, file));
			
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

	const rest = new REST().setToken(process.env.BOT_TOKEN);
	const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

	try {
		if (process.env.GLOBAL_COMMANDS.toLowerCase() !== 'true') {
			if (!process.env.COMMAND_GUILD_ID) {
				Logger.error('COMMAND_GUILD_ID is not set in .env but GLOBAL_COMMANDS is false. Cannot register guild-specific commands.');
				process.exit(1);
			}

			Logger.debug('Clearing old guild commands...');
			await rest.put(Routes.applicationGuildCommands(process.env.BOT_APP_ID, process.env.COMMAND_GUILD_ID), { body: [] });
			Logger.debug('Waiting 2 seconds before registering new commands...');
			await delay(2000);
			Logger.debug('Registering new guild commands...');
			await rest.put(Routes.applicationGuildCommands(process.env.BOT_APP_ID, process.env.COMMAND_GUILD_ID), { body: bot.slashCommandsData });
			Logger.success(`Registered commands to guild ID ${process.env.COMMAND_GUILD_ID}`);
		} else {
			Logger.debug('Clearing old global commands...');
			await rest.put(Routes.applicationCommands(process.env.BOT_APP_ID), { body: [] });
			Logger.debug('Waiting 2 seconds before registering new commands...');
			await delay(2000);
			Logger.debug('Registering new global commands...');
			await rest.put(Routes.applicationCommands(process.env.BOT_APP_ID), { body: bot.slashCommandsData });
			Logger.success('Registered global commands');
		}
	} catch (error) {
		Logger.error(`Failed to register slash commands: ${error}`);
	}
}