# browser-exception-collector (WIP)

[![npm version](https://img.shields.io/npm/v/browser-exception-collector.svg)](https://www.npmjs.com/package/browser-exception-collector)

An exception collector for browser

## Installation

```bash
# npm
npm install browser-exception-collector

# yarn
yarn add browser-exception-collector
```

## Usage

```ts
import { ExceptionCollector } from 'browser-exception-collector';

const collector = new ExceptionCollector();

collector.onError(error => {
  console.error('onError', error);
  console.log('onError', JSON.parse(error.toJSON()));
});

collector.onUnhandledRejection(error => {
  console.error('onUnhandledRejection', error);
  console.log('onUnhandledRejection', JSON.parse(error.toJSON()));
});
```

## APIs

- ExceptionCollector
  - `new ExceptionCollector(options)`
    - `options.debug`
  - `ExceptionCollector.prototype.dispose()`
  - `ExceptionCollector.prototype.on(type, handler)`
  - `ExceptionCollector.prototype.onError(handler)`
  - `ExceptionCollector.prototype.onUnhandledRejection(handler)`
  - `ExceptionCollector.prototype.onRejectionHandled(handler)`
- CustomError
  - `new CustomError(message, errorInit)`
  - `CustomError.prototype.toString()`
  - `CustomError.prototype.toJSON()`

## License

MIT © Qingrong Ke
