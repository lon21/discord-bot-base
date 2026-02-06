import { getCurrentTime } from './date';
import { green, blue, red, yellow } from 'picocolors';

export class Logger {
	private static baseLog(colorFunction: (str: string) => string, prefix: string, args: any[]) {
		console.log(`[${getCurrentTime()}] ${colorFunction(`[${prefix}]: ${args.join(' ')}`)}`);
	}

	static success(...args: any[]) {
		this.baseLog(green, 'SUCCESS', args);
	}

	static info(...args: any[]) {
		this.baseLog(blue, 'INFO', args);
	}

	static error(...args: any[]) {
		this.baseLog(red, 'ERROR', args);
	}

	static debug(...args: any[]) {
		if (process.env.NODE_ENV.toLowerCase() !== 'development') return;
		this.baseLog(yellow, 'DEBUG', args);
	}
}