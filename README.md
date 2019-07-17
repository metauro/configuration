# nest-configuration

Easily Change Configurations In Different Environments For Nestjs

### Installation

#### Yarn

```shell
yarn add nest-configuration
```

#### NPM

```shell
npm i nest-configuration --save
```

# Getting Started

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
  })
  loggerLevel: string;

  // use generics to constrain values
  @Config<string>({
    base: 'api',
  })
  globalPrefix: string;
}
```
