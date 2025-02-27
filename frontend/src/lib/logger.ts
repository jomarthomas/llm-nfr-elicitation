// src/utils/logger.ts

export class Logger {
	static async info(message: string, ...optionalParams: unknown[]) {
		console.info(`[INFO] ${message}`, ...optionalParams);
		await this.logToFile('INFO', message, optionalParams);
	}

	static async warn(message: string, ...optionalParams: unknown[]) {
		console.warn(`[WARN] ${message}`, ...optionalParams);
	}

	static async error(message: string, ...optionalParams: unknown[]) {
		console.error(`[ERROR] ${message}`, ...optionalParams);
	}

	static async debug(message: string, ...optionalParams: unknown[]) {
		console.debug(`[DEBUG] ${message}`, ...optionalParams);
	}
}
