import merge from 'lodash.merge';
import { CONFIG_METADATA, env } from './constants';
import { EnvVariable } from './interface';

export const Configure = <T extends new (...arg: any[]) => any>(target: T) => {
  return class extends target {
    constructor(...args: any[]) {
      super(...args);
      (Reflect.getMetadata(CONFIG_METADATA, target.prototype) || []).forEach(
        property => {
          const envVariable: EnvVariable = Reflect.getMetadata(
            CONFIG_METADATA,
            target.prototype,
            property,
          );
          const propertyType = Reflect.getMetadata(
            'design:type',
            target.prototype,
            property,
          );

          if (
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
