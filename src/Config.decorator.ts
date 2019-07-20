import { ConfigOptions } from './interface';
import { CONFIG_METADATA } from './constants';

export const Config: <T = any>(
  configOptions: ConfigOptions<T>,
) => PropertyDecorator = ({ envVariable, configurationOptions }) => {
  return (target, propertyKey) => {
    if (!Reflect.getMetadata(CONFIG_METADATA, target)) {
      Reflect.defineMetadata(CONFIG_METADATA, [], target);
    }
    Reflect.getMetadata(CONFIG_METADATA, target).push(propertyKey);
    Reflect.defineMetadata(CONFIG_METADATA, envVariable, target, propertyKey);
    Reflect.defineMetadata(
      CONFIG_METADATA,
      configurationOptions,
      target,
      propertyKey,
    );
  };
};
