import { ConfigurationError } from '../error';

interface Logger {
  log(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export class LoggerTool {
  private static readonly logger = console;

  static log(level: keyof Logger, message: string) {
    LoggerTool.logger[level](`[nest-configuration ${level}]: ${message}`);
  }

  static warn(message: string) {
    return LoggerTool.log('warn', message);
  }

  static error(message: string) {
    throw new ConfigurationError(message);
  }
}
