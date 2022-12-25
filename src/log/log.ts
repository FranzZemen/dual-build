/**
 * A minimal feature console logger
 * @module build-tools/log
 * @author Franz zemen
 * @licence MIT
 */
import {inspect} from 'node:util';
import {performance} from 'node:perf_hooks';

export enum ConsoleCode {
  //  ref = 'https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797#colors--graphics-mode',
  Reset = '\x1b[0m',
  Bright = '\x1b[1m',
  Dim = '\x1b[2m',
  Underscore = '\x1b[4m',
  Blink = '\x1b[5m',
  Reverse = '\x1b[7m',
  Hidden = '\x1b[8m',
}

export enum ForegroundColor {
  // ref = 'https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797#colors--graphics-mode',
  _8_ForegroundBlack = '\x1b[30m',
  _8_ForegroundRed = '\x1b[31m',
  _8_ForegroundGreen = '\x1b[32m',
  _8_ForegroundYellow = '\x1b[33m',
  _8_ForegroundBlue = '\x1b[34m',
  _8_ForegroundMagenta = '\x1b[35m',
  _8_ForegroundCyan = '\x1b[36m',//console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan
  _8_ForegroundWhite = '\x1b[37m',
  _256_ForegroundDullGreen29 = '\x1B[38;5;29m',
  _256_ForegroundOrange208 = '\x1B[38;5;208m'
}

export enum BackgroundColor {
  _8_BackgroundBlack = '\x1b[40m',
  _8_BackgroundRed = '\x1b[41m',
  _8_BackgroundGreen = '\x1b[42m',
  _8_BackgroundYellow = '\x1b[43m',
  _8_BackgroundBlue = '\x1b[44m',
  _8_BackgroundMagenta = '\x1b[45m',
  _8_BackgroundCyan = '\x1b[46m',
  _8_BackgroundWhite = '\x1b[47m',
};

export type LogLevel = {
  debug: 0;
  info: 1;
  warn: 2,
  error: 3;
  trace: 4;
};

const logLevelValues: LogLevel = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  trace: 4
};

export type LogLevelKey = keyof LogLevel;


export type ColorScheme = { foreground: ForegroundColor, background: BackgroundColor };


export type ColorSchemes = {
  [key in keyof LogLevel | string]: ColorScheme;
};

export type LogConfig = {
  level: LogLevelKey,
  colorSchemes: ColorSchemes
}

/**
 * Log configuration object
 * @property {string} level     - The log level
 * @type {{colorSchemes: {warn: {background: string, foreground: string}, finer: {background: string, foreground: string}, debug: {background: string, foreground: string}, none: {background: string, foreground: string}, error: {background: string, foreground: string}, info: {background: string, foreground: string}}, level: string}}
 */
export let logConfig: LogConfig = {
  level: 'info',
  colorSchemes: {
    // Default log level schemes
    info: {
      foreground: ForegroundColor._8_ForegroundGreen,
      background: BackgroundColor._8_BackgroundBlack
    },
    warn: {
      foreground: ForegroundColor._8_ForegroundYellow,
      background: BackgroundColor._8_BackgroundBlack
    },
    error: {
      foreground: ForegroundColor._8_ForegroundRed,
      background: BackgroundColor._8_BackgroundBlack
    },
    trace: {
      foreground: ForegroundColor._8_ForegroundRed,
      background: BackgroundColor._8_BackgroundBlack
    },
    debug: {
      foreground: ForegroundColor._8_ForegroundBlue,
      background: BackgroundColor._8_BackgroundBlack
    },
    task: {
      foreground: ForegroundColor._256_ForegroundDullGreen29,
      background: BackgroundColor._8_BackgroundBlack
    }
  }
};


export class Log {
  protected logLevel: LogLevelKey;

  protected foreground = ForegroundColor._8_ForegroundGreen;
  protected background = BackgroundColor._8_BackgroundBlack;

  timings: string[] = [];

  constructor() {
    this.logLevel = logConfig.level ?? 'info';
  }


  protected get logLevelValue(): number {
    return logLevelValues[this.logLevel];
  }

  /**
   * Get the color string
   * @param scheme {LogLevel}
   */
  protected color(scheme: keyof LogLevel | string): string {
    let foreground = this.foreground, background = this.background;
    if (scheme) {
      foreground = logConfig?.colorSchemes[scheme]?.foreground ?? ForegroundColor._8_ForegroundGreen;
      background = logConfig?.colorSchemes[scheme]?.background ?? BackgroundColor._8_BackgroundBlack;
    }

    return foreground + background;
  }

  error(data: Error | string) { // Force that error is always an Error or a string
    if (data && this.logLevelValue <= logLevelValues.error) {
      this.errorImpl(data, 'error');
    }
  }

  trace(data: any) {
    if (data && this.logLevelValue <= logLevelValues.trace) {
      this.errorImpl(data, 'trace');
    }
  }

  warn(data: any) {
    if (data && this.logLevelValue <= logLevelValues.warn) {
      this.errorImpl(data, 'warn');
    }
  }

  protected errorImpl(data: string | any, logMethodAndScheme: keyof LogLevel) {
    if (typeof data === 'string') {
      data = this.color(logMethodAndScheme) + data + ConsoleCode.Reset;
      console[logMethodAndScheme](data);
    } else if (data && data instanceof Error) {
      if (data.stack) {
        data.stack = data.stack.replaceAll(' at', this.color(logMethodAndScheme) + ' at') + ConsoleCode.Reset;
      }
      console[logMethodAndScheme](this.color(logMethodAndScheme));
      console[logMethodAndScheme](data);
      console[logMethodAndScheme](ConsoleCode.Reset);
    } else {
      console[logMethodAndScheme](inspect(data, false, 10, true));
    }
  }

  protected _log(data: any, logMethod: keyof LogLevel, scheme: keyof LogLevel | string) {
    if (typeof data === 'string') {
      data = this.color(scheme) + data + ConsoleCode.Reset;
      console.log(data);
    } else {
      console[logMethod](inspect(data, false, 10, true));
    }
  }

  info(data: any) {
    if (data && (this.logLevelValue <= logLevelValues.info)) {
      this._log(data, 'info', 'info');
    }
  }

  debug(data: any) {
    if (data && (this.logLevelValue <= logLevelValues.debug)) {
      this._log(data, 'debug', 'debug');
    }
  }

  /**
   * Logs anything at the info or debug level leveraging a custom colorScheme.  Otherwise use the dedicated methods.  This
   * is only enforced at the typescript level, so if you really, really want to you can override with ts-ignore or use javascript.
   * The enforcement is for good design, no side effects on go around
   * @param data
   * @param logMethod
   * @param scheme
   */
  log(data: any, logMethod: keyof Exclude<LogLevel, 'trace | error | warn'>, scheme: keyof LogLevel | string) {
    this._log(data, logMethod, scheme)
  }
}


