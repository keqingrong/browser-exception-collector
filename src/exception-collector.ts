import mitt, { Handler } from 'mitt';
import { CustomError, toCustomError } from './custom-error';
import { Options, EventType, ErrorHandler } from './types';
import { log } from './utils';

export class ExceptionCollector {
  private debug = false;
  private emitter = mitt();

  constructor(options: Partial<Options> = {}) {
    if (options.debug) {
      this.debug = options.debug;
    }
    this.subscribe();
  }

  /**
   * 订阅事件
   */
  private subscribe = () => {
    window.addEventListener('error', this.onErrorInternal, true);
    window.addEventListener(
      'unhandledrejection',
      this.onUnhandledRejectionInternal,
      false
    );
    window.addEventListener(
      'rejectionhandled',
      this.onRejectionHandledInternal,
      false
    );
  };

  /**
   * 取消事件订阅
   */
  private unsubscribe = () => {
    window.removeEventListener('error', this.onErrorInternal, true);
    window.removeEventListener(
      'unhandledrejection',
      this.onUnhandledRejectionInternal,
      false
    );
    window.removeEventListener(
      'rejectionhandled',
      this.onRejectionHandledInternal,
      false
    );
  };

  /**
   * 发送消息
   */
  private emit = (type: EventType, error: CustomError) => {
    this.debug && log(type, error.toJSON());
    this.emitter.emit(type, error);
  };

  /**
   * `unhandledrejection` 事件监听
   * - `window.onunhandledrejection`
   * - `window.addEventListener('unhandledrejection', handler, false)`
   */
  private onUnhandledRejectionInternal = (event: PromiseRejectionEvent) => {
    const { reason } = event;
    const err = new CustomError(reason);
    this.emit('unhandledrejection', err);
  };

  /**
   * `rejectionhandled` 事件监听
   * - `window.onrejectionhandled`
   * - `window.addEventListener('rejectionhandled', handler, false)`
   */
  private onRejectionHandledInternal = (event: PromiseRejectionEvent) => {
    const { reason } = event;
    const err = new CustomError(reason);
    this.emit('rejectionhandled', err);
  };

  /**
   * `error` 事件监听
   */
  private onErrorInternal = (event: ErrorEvent | Event) => {
    if (event instanceof ErrorEvent) {
      this.onWindowErrorInternal(event);
    } else {
      this.onElementErrorInternal(event);
    }
  };

  /**
   * `error` 事件监听
   * - `window.onerror`
   * - `window.addEventListener('error', handler, false)`
   */
  private onWindowErrorInternal = (event: ErrorEvent) => {
    const { filename, lineno, colno, message } = event;
    const error: Error | null = event.error;
    const errInit = {
      fileName: filename,
      lineNumber: lineno,
      columnNumber: colno
    };
    const err =
      error === null
        ? new CustomError(message, errInit)
        : toCustomError(error, errInit);
    this.emit('error', err);
  };

  /**
   * `error` 事件监听
   * - `element.onerror`
   * - `window.addEventListener('error', handler, true)`
   */
  private onElementErrorInternal = (event: Event) => {
    const { target } = event;
    if (
      target instanceof HTMLLinkElement ||
      target instanceof HTMLImageElement ||
      target instanceof HTMLScriptElement ||
      target instanceof HTMLSourceElement
    ) {
      const htmlContent = target.outerHTML;
      // const url = 'src' in target ? target.src : target.href;
      // const message = `Failed to load resource '${url}' in ${target.tagName.toLowerCase()}`;
      const message = `Failed to load resource at ${htmlContent}`;
      const err = new CustomError(message, { fileName: import.meta.url });
      this.emit('error', err);
    } else {
      console.warn('[ExceptionCollector] Unhandled error event', event);
    }
  };

  /**
   * 释放资源
   */
  dispose() {
    this.emitter.all.clear();
    this.unsubscribe();
  }

  /**
   * 监听错误和 Promise rejection
   */
  on<T>(type: EventType, handler: ErrorHandler<T>) {
    this.emitter.on(type, handler as Handler);
    return () => this.emitter.off(type, handler as Handler);
  }

  /**
   * 监听 `error` 事件
   */
  onError(handler: ErrorHandler<CustomError>) {
    return this.on('error', handler);
  }

  /**
   * 监听 `unhandledrejection` 事件
   */
  onUnhandledRejection(handler: ErrorHandler<CustomError>) {
    return this.on('unhandledrejection', handler);
  }

  /**
   * 监听 `unhandledrejection` 事件
   */
  onRejectionHandled(handler: ErrorHandler<CustomError>) {
    return this.on('rejectionhandled', handler);
  }
}
