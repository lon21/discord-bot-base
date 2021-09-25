import { CommandInteraction } from "discord.js";
import bot from '../bot';
import { BotCommand } from '../types';

export default <BotCommand> {
	name: 'ping',
	description: 'Pokazuje ping bota z ws',
	run: async (interaction: CommandInteraction) => {
		interaction.reply(`Pong, mój ping z ws discorda to \`${bot.ws.ping}ms\``);
	},
};