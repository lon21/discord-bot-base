import 'reflect-metadata';
import { METADATA_KEY } from './constants';
import { EventDecoratorOptions } from '../interfaces';

export function RegisterEvent(options: EventDecoratorOptions) {
	return function (target: Function) {
		Reflect.defineMetadata(METADATA_KEY.EVENT, options, target);
	}
}

export const getEventMetadata = (target: any): EventDecoratorOptions => {
	return Reflect.getMetadata(METADATA_KEY.EVENT, target);
}