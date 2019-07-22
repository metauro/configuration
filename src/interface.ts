export interface ConfigurationOptions {
  securityOptions?: SecurityOptions;
  /**
   * special current env
   * default: process.env.NODE_ENV
   */
  env?: Env;
}

export interface ConfigOptions<T = any> {
  envVariable: EnvVariable<T>;
  /**
   * override global configuration options
   */
  configurationOptions?: ConfigurationOptions;
}

export type Env = 'development' | 'production' | 'test' | string;
export type EnvVariable<T = any> = { [key in Env]?: T };

export interface SecurityOptions {
  /**
   * custom decrypt function
   * default using RSA
   * @param encryptedValue
   */
  decrypt?: (encryptedValue: string) => string;
  /**
   * if true it will call decrypt function to decrypt it
   * default: false
   */
  encrypted?: boolean;
  /**
   * RSA private key file path
   * if encrypted option is true, you must specify this option
   */
  privateKeyFilePath?: string;
}
