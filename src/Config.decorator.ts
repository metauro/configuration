import { EnvVariable } from './interface';
import { CONFIG_METADATA } from './constants';

export const Config: <T = any>(
  envVariable: EnvVariable<T>,
) => PropertyDecorator = envVariable => {
  return (target, propertyKey) => {
    if (!Reflect.getMetadata(CONFIG_METADATA, target)) {
      Reflect.defineMetadata(CONFIG_METADATA, [], target);
    }
    Reflect.getMetadata(CONFIG_METADATA, target).push(propertyKey);
    Reflect.defineMetadata(CONFIG_METADATA, envVariable, target, propertyKey);
  };
};
