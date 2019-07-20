import merge = require('lodash.merge');
import { CONFIG_METADATA, NODE_ENV } from './constants';
import { ConfigOptions, ConfigurationOptions } from './interface';
import { SecurityTool } from './security.tool';
import { LoggerTool } from './logger.tool';

type PartialDepth<T> = T extends object
  ? Partial<{ [K in keyof T]: PartialDepth<T[K]> }>
  : T;

export const Configuration = <T extends new (...arg: any[]) => any>(
  configurationOptions: ConfigurationOptions,
) => {
  return (target: T) => {
    return class extends target {
      constructor(...args: any[]) {
        super(...args);
        (Reflect.getMetadata(CONFIG_METADATA, target.prototype) || []).forEach(
          property => {
            const {
              envVariable,
              configurationOptions: singleConfigurationOptions,
            }: ConfigOptions = Reflect.getMetadata(
              CONFIG_METADATA,
              target.prototype,
              property,
            );
            const propertyType = Reflect.getMetadata(
              'design:type',
              target.prototype,
              property,
            );
            const {
              securityOptions: { encrypted, decrypt, privateKeyFilePath },
              env,
            } = merge<PartialDepth<ConfigurationOptions>, ConfigurationOptions>(
              {
                securityOptions: {
                  encrypted: false,
                  decrypt(val) {
                    return SecurityTool.decrypt(val, privateKeyFilePath);
                  },
                },
                env: NODE_ENV,
              },
              singleConfigurationOptions || configurationOptions || {},
            );

            if (encrypted && propertyType !== String) {
              LoggerTool.warn(
                `only support encrypt string, please check ${target.name}.${property}`,
              );
            }

            if (encrypted && propertyType === String) {
              try {
                this[property] = decrypt(envVariable[env] || envVariable.base);
              } catch (err) {
                LoggerTool.error(err);
              }
            } else if (
              propertyType === Number ||
              propertyType === String ||
              propertyType === Boolean ||
              propertyType === Symbol ||
              propertyType === Function ||
              propertyType === null ||
              propertyType === undefined
            ) {
              this[property] = envVariable[env] || envVariable.base;
            } else {
              this[property] = merge(envVariable[env], envVariable.base);
            }
          },
        );
      }
    };
  };
};
