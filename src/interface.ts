export interface EnvVariable<T = any> {
  base?: T;
  production?: T;
  development?: T;
  test?: T;
  [key: string]: T;
}
