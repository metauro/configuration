# nest-configuration

Easily Change Configurations In Different Environments For Nestjs

### Installation

#### Yarn

```shell
yarn add nest-configuration cross-env
```

#### NPM

```shell
npm i nest-configuration cross-env --save
```

# Getting Started

In first, create your own config service

```typescript
// app-config.service.ts
import { Configuration, Config } from 'nestjs-configuration';

@Configuration
export class AppConfigService {
  // The value depends on process.env.NODE_ENV
  @Config({
    development: 3000,
    production: 8080,
  })
  port: number;

  // it will use base value if current env value is not define
  // if env value is object, it will merge base and env value
  @Config({
    base: 'info',
    development: 'debug',
    production: 'warn',
  })
  loggerLevel: string;

  // use generics to constrain values
  @Config<string>({
    base: 'api',
  })
  globalPrefix: string;
}
```

And ensure your all start script has assign NODE_ENV to special env

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=development ts-node -r tsconfig-paths/register src/main.ts",
    "start:dev": "cross-env NODE_ENV=development concurrently --handle-input \"wait-on dist/main.js && nodemon\" \"tsc -w -p tsconfig.build.json\" ",
    "start:debug": "cross-env NODE_ENV=development nodemon --config nodemon-debug.json",
    "start:prod": "cross-env NODE_ENV=production node dist/main.js",
    "test": "cross-env NODE_ENV=test jest",
    "test:watch": "cross-env NODE_ENV=test jest --watch",
    "test:cov": "corss-env NODE_ENV=test jest --coverage",
    "test:debug": "cross-env NODE_ENV=test node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "cross-env NODE_ENV=test jest --config ./test/jest-e2e.json"
  }
}
```
