import merge = require('lodash.merge');
import { CONFIG_METADATA, NODE_ENV } from './constants';
import { ConfigOptions, ConfigurationOptions } from './interface';
import { LoggerTool, SecurityTool } from './tools';
import { PartialDepth } from './interface';

export const Configuration = <T extends new (...arg: any[]) => any>(
  configurationOptions: ConfigurationOptions,
) => {
  return (target: T) => {
    return class extends target {
      constructor(...args: any[]) {
        super(...args);
        (Reflect.getMetadata(CONFIG_METADATA, target.prototype) || []).forEach(
          (property: string) => {
            const {
              envVariable,
              configurationOptions: singleConfigurationOptions,
            }: ConfigOptions = Reflect.getMetadata(
              CONFIG_METADATA,
              target.prototype,
              property,
            );
            const {
              securityOptions: { encrypted, decrypt },
              env,
            } = merge<PartialDepth<ConfigurationOptions>, ConfigurationOptions>(
              {
                securityOptions: {
                  encrypted: false,
                  decrypt(val: string) {
                    if (typeof val !== 'string') {
                      LoggerTool.warn(
                        'default decrypt function only support string type',
                      );
                      return val;
                    }

                    return SecurityTool.decrypt(val);
                  },
                },
                env: NODE_ENV,
              },
              merge(
                configurationOptions || {},
                singleConfigurationOptions || {},
              ),
            );
            this[property] = envVariable[env];

            if (envVariable[env] === undefined) {
              this[property] = envVariable.base;
            }
            // merge if both are object
            else if (
              typeof envVariable[env] === 'object' &&
              typeof envVariable.base === typeof envVariable[env]
            ) {
              this[property] = merge(envVariable[env], envVariable.base);
            }

            if (encrypted) {
              this[property] = decrypt(this[property]);
            }
          },
        );
      }
    };
  };
};
