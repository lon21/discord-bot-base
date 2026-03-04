import { ModalSubmitInteraction } from 'discord.js';

export abstract class BaseModal {
	abstract run(interaction: ModalSubmitInteraction): Promise<void>;
}
