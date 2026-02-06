import 'reflect-metadata';
import { CommandDecoratorOptions } from '../interfaces';
import { METADATA_KEY } from './constants';

export function RegisterCommand(options: CommandDecoratorOptions) {
	return function (target: any) {
		Reflect.defineMetadata(METADATA_KEY.COMMAND, options, target);
	}
}

export const getCommandMetadata = (target: any): CommandDecoratorOptions => {
	return Reflect.getMetadata(METADATA_KEY.COMMAND, target);
}