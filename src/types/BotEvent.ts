export interface BotEvent {
	block?: boolean;
	run: ({ }) => Promise<void>;
}