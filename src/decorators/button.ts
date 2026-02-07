import 'reflect-metadata';
import { ButtonDecoratorOptions } from '../interfaces';
import { METADATA_KEY } from './constants';

export function RegisterButton(options: ButtonDecoratorOptions) {
	return function (target: any) {
		Reflect.defineMetadata(METADATA_KEY.BUTTON, options, target);
	}
}

export const getButtonMetadata = (target: any): ButtonDecoratorOptions => {
	return Reflect.getMetadata(METADATA_KEY.BUTTON, target);
}