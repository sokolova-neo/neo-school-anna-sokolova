/* eslint-disable no-console, @typescript-eslint/no-explicit-any */

interface Logger {
  error: (...params: any[]) => void;
  debug: (...params: any[]) => void;
  warn: (...params: any[]) => void;
  info: (...params: any[]) => void;
}

const logger: Logger = {
  error: (...params: any[]): void => {
    console.error('[ERROR]', ...params);
  },
  debug: (...params: any[]): void => {
    console.log('[DEBUG]', ...params);
  },
  warn: (...params: any[]): void => {
    console.warn('[WARN]', ...params);
  },
  info: (...params: any[]): void => {
    console.info('[INFO]', ...params);
  },
};

export { logger };
