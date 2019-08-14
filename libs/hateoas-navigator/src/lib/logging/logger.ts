export enum LogLevel {TRACE, DEBUG, INFO, WARN, ERROR}

export class Logger {
  constructor(private logLevel: LogLevel) {
  }

  error(msg: string) {
    this.log(msg, LogLevel.ERROR, m => console.error(m));
  }

  warn(msg: string) {
    this.log(msg, LogLevel.WARN, m => console.warn(m));
  }

  /* tslint:disable:no-console */

  info(msg: string) {
    this.log(msg, LogLevel.INFO, m => console.info(m));
  }

  debug(msg: string) {
    this.log(msg, LogLevel.DEBUG, m => console.debug(m));
  }

  trace(msg: string) {
    this.log(msg, LogLevel.TRACE, m => console.debug(m));
  }

  private log(msg: string, logLevel: LogLevel, fct: (msg: string) => void) {
    if (this.logLevel <= logLevel) {
      fct(msg);
    }
  }
}

export const LOGGER = new Logger(LogLevel.DEBUG);
