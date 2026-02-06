export abstract class BaseEvent {
	abstract run(...args: any[]): Promise<any>;
}