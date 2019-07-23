import merge = require('lodash.merge');
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { path as rootPath } from 'app-root-path';
import { LoggerTool } from './logger.tool';

const algorithm = 'aes-256-cbc';

interface SecurityParsedOptions {
  password: string;
  key: string;
}

interface SecurityOptions {
  // default ${rootPath}/jsconfig.json
  configFilePath?: string;

  /**
   * encrypt & decrypt password
   */
  password?: string;
}

export class SecurityTool {
  private static options: SecurityOptions = {
    configFilePath: null,
    password: null,
  };

  static setOptions(options: SecurityOptions): void {
    SecurityTool.options = options;
  }

  static patchOptions(options: Partial<SecurityOptions>): void {
    merge(SecurityTool.options, options);
  }

  static getOptions(): SecurityOptions {
    return SecurityTool.options;
  }

  static fixLen(val: string, len: number) {
    let result = val;
    let i = 0;

    while (result.length < len) {
      result += val[i++];
      if (val[i] === undefined) {
        i = 0;
      }
    }

    if (result.length > len) {
      result = result.slice(0, len);
    }

    return result;
  }

  static parseOptions(): SecurityParsedOptions {
    let { password, configFilePath } = SecurityTool.getOptions();
    let key = password;

    if (!password) {
      configFilePath = configFilePath
        ? path.join(process.cwd(), configFilePath)
        : path.join(rootPath, 'jsconfig.json');

      if (!fs.existsSync(configFilePath)) {
        if (configFilePath) {
          LoggerTool.error('config file does not exists');
        } else {
          LoggerTool.error('please provide --password or --config option');
        }
      }

      const config: SecurityParsedOptions = JSON.parse(
        fs.readFileSync(configFilePath, 'utf8'),
      );

      if (!config.password) {
        LoggerTool.error(`please provide password option in ${configFilePath}`);
      }

      key = password = config.password;
    }

    return {
      password: SecurityTool.fixLen(password, 16),
      key: SecurityTool.fixLen(key, 32),
    };
  }

  static encrypt(decryptedValue: string): string {
    const { password, key } = SecurityTool.parseOptions();
    const cipher = crypto.createCipheriv(
      algorithm,
      Buffer.from(key),
      Buffer.from(password),
    );
    cipher.update(decryptedValue, 'utf8', 'hex');
    return cipher.final('hex');
  }

  static decrypt(encryptedValue: string): string {
    const { password, key } = SecurityTool.parseOptions();
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(key),
      Buffer.from(password),
    );
    decipher.update(encryptedValue, 'hex', 'utf8');
    return decipher.final('utf8');
  }
}
