import 'reflect-metadata';
import { ModalDecoratorOptions } from '../interfaces';
import { METADATA_KEY } from './constants';

export function RegisterModal(options: ModalDecoratorOptions) {
	return function (target: any) {
		Reflect.defineMetadata(METADATA_KEY.MODAL, options, target);
	}
}

export const getModalMetadata = (target: any): ModalDecoratorOptions => {
	return Reflect.getMetadata(METADATA_KEY.MODAL, target);
}
