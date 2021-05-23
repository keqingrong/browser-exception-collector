export interface MozillaStyleError {
  name: string;
  message: string;
  stack: string;
  fileName: string;
  columnNumber: number;
  lineNumber: number;
}

export interface ChromiumStyleError {
  name: string;
  message: string;
  stack: string;
}

export type UniversalError = MozillaStyleError & ChromiumStyleError;

export interface ErrorInit {
  name: string;
  stack: string;
  fileName: string;
  columnNumber: number;
  lineNumber: number;
}

export interface Options {
  debug: boolean;
}

export type EventType = 'error' | 'unhandledrejection' | 'rejectionhandled';

export type ErrorHandler<T = Error> = (Error: T) => void;
