import { ErrorInit, UniversalError } from './types';

export class CustomError extends Error {
  name = 'CustomError';
  stack = '';
  fileName = '';
  columnNumber = 0;
  lineNumber = 0;

  constructor(message: string, errorInit?: Partial<ErrorInit>) {
    super(message);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    } else {
      const err = new Error(message);
      if (err.stack) {
        this.stack = err.stack;
      }
    }

    if (errorInit) {
      if (errorInit.name) {
        this.name = errorInit.name;
      }
      if (errorInit.stack) {
        this.stack = errorInit.stack;
      }
      if (errorInit.fileName) {
        this.fileName = errorInit.fileName;
      }
      this.columnNumber = errorInit.columnNumber || 0;
      this.lineNumber = errorInit.lineNumber || 0;
    }
  }

  toString() {
    const name = this.name ?? '';
    const message = this.message ?? '';
    if (name.length === 0) {
      return `${message}`;
    } else if (message.length === 0) {
      return `${name}`;
    } else {
      return `${name}: ${message}`;
    }
  }

  toJSON() {
    return JSON.stringify({
      name: this.name,
      message: this.message,
      stack: this.stack,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber
    });
  }
}

export function toCustomError(
  error: Error,
  errorInit: Partial<ErrorInit> = {}
) {
  const alias = error as UniversalError;
  return new CustomError(error.message, {
    name: errorInit.name || error.name,
    stack: errorInit.stack || error.stack,
    fileName: errorInit.fileName || alias.fileName,
    lineNumber: errorInit.lineNumber ?? alias.lineNumber,
    columnNumber: errorInit.columnNumber ?? alias.columnNumber
  });
}
