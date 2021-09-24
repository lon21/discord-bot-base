import { CommandInteraction } from "discord.js";
import bot from '../Structures/bot';
import { BotCommand } from '../Types/handlingTypes';

export default <BotCommand> {
	name: 'ping',
	description: 'Pokazuje ping bota z ws',
	run: async (interaction: CommandInteraction) => {
		interaction.reply(`Pong, mój ping z ws discorda to \`${bot.ws.ping}ms\``);
	},
};