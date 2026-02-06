import { ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { RegisterCommand } from '../decorators';
import { BaseSlashCommand } from '../interfaces';

@RegisterCommand({
	name: 'eval',
	description: 'Evaluates arbitrary JavaScript code',
	ownerOnly: true,
	options: [{
		name: 'code',
		description: 'The JavaScript code to evaluate',
		type: 'STRING',
		required: true,
	}]
})
export class EvalCommand extends BaseSlashCommand {
	async run(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		const code = interaction.options.getString('code', true);

		try {
			let evaled = eval(code);
			if (evaled instanceof Promise) {
				evaled = await evaled;
			}

			const inspected = typeof evaled === 'string' ? evaled : require('util').inspect(evaled, { depth: 0 });
			const truncated = inspected.length > 1900 ? inspected.slice(0, 1900) + '... (truncated)' : inspected;
			
			await interaction.editReply({ content: `\`\`\`js\n${truncated}\n\`\`\``});
		} catch (error) {
			await interaction.editReply({ content: `❌ Error during evaluation:\n\`\`\`js\n${error instanceof Error ? error.stack || error.message : String(error)}\n\`\`\`` });
		}
	}
}