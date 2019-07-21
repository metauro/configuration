import { ConfigurationError } from '../error';

export class LoggerTool {
  private static readonly logger = console;

  static log(level: keyof typeof console, message: string) {
    LoggerTool.logger[level](`[nest-configuration ${level}]: ${message}`);
  }

  static warn(message: string) {
    return LoggerTool.log('warn', message);
  }

  static error(message: string) {
    throw new ConfigurationError(message);
  }
}
