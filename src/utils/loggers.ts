import { getCurrentTime } from './date';
import { green, blue, red, yellow, magenta } from 'picocolors';

export class Logger {
	private static baseLog(colorFunction: (str: string) => string, prefix: string, args: any[]) {
		console.log(`[${getCurrentTime()}] ${colorFunction(`[${prefix}]: ${args.join(' ')}`)}`);
	}

	static success = (...args: any[]) => {
		Logger.baseLog(green, 'SUCCESS', args);
	};

	static info = (...args: any[]) => {
		Logger.baseLog(blue, 'INFO', args);
	};

	static error = (...args: any[]) => {
		Logger.baseLog(red, 'ERROR', args);
	};

	static warn = (...args: any[]) => {
		Logger.baseLog(magenta, 'WARN', args);
	};

	static debug = (...args: any[]) => {
		if ((Bun.env.NODE_ENV ?? '').toLowerCase() !== 'development') return;
		Logger.baseLog(yellow, 'DEBUG', args);
	};
}