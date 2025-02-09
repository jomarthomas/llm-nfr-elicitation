// src/utils/logger.ts

export class Logger {
  private static async logToFile(
    level: string,
    message: string,
    optionalParams: unknown[]
  ) {
    const logMessage = `[${level}] ${message} ${optionalParams.join(" ")}\n`;
    const logFilePath = new URL(
      `../logs/run-${level}-${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.log`,
      import.meta.url
    ).pathname;

    // Write the log message to a new file with a timestamped name
    await Deno.writeTextFile(logFilePath, logMessage, { append: true });

    // Clean up old log files
    const logDirPath = new URL("../logs/", import.meta.url).pathname;
    const logFiles = Array.from(Deno.readDirSync(logDirPath))
      .filter(
        (file) =>
          file.isFile &&
          file.name.startsWith("run-") &&
          file.name.endsWith(".log")
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    // Ensure there are no more than 5 log files
    while (logFiles.length > 5) {
      const oldestLogFile = logFiles.shift();
      if (oldestLogFile) {
        await Deno.remove(`${logDirPath}/${oldestLogFile.name}`);
      }
    }
  }

  static async info(message: string, ...optionalParams: unknown[]) {
    console.info(`[INFO] ${message}`, ...optionalParams);
    await this.logToFile("INFO", message, optionalParams);
  }

  static async warn(message: string, ...optionalParams: unknown[]) {
    console.warn(`[WARN] ${message}`, ...optionalParams);
    await this.logToFile("WARN", message, optionalParams);
  }

  static async error(message: string, ...optionalParams: unknown[]) {
    console.error(`[ERROR] ${message}`, ...optionalParams);
    await this.logToFile("ERROR", message, optionalParams);
  }

  static async debug(message: string, ...optionalParams: unknown[]) {
    console.debug(`[DEBUG] ${message}`, ...optionalParams);
    await this.logToFile("DEBUG", message, optionalParams);
  }
}
