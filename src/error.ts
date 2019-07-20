export class ConfigurationError extends Error {
  constructor(message: string) {
    super(`[nest-configuration]: ${message}`);
  }
}
