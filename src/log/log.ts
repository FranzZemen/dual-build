/**
 * A minimal feature console logger
 * @module build-tools/log
 * @author Franz zemen
 * @licence MIT
 */
import {inspect} from 'node:util';
import {debug} from 'util';

export enum ConsoleCode {
  //  ref = 'https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797#colors--graphics-mode',
  Reset = '\\x1b[0m',
  Bright = '\\x1b[1m',
  Dim = '\\x1b[2m',
  Underscore = '\\x1b[4m',
  Blink = '\\x1b[5m',
  Reverse = '\\x1b[7m',
  Hidden = '\\x1b[8m',
}

export enum Color {
  // ref = 'https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797#colors--graphics-mode',
  _8_ForegroundBlack = '\\x1b[30m',
  _8_ForegroundRed = '\\x1b[31m',
  _8_ForegroundGreen = '\\x1b[32m',
  _8_ForegroundYellow = '\\x1b[33m',
  _8_ForegroundBlue = '\\x1b[34m',
  _8_ForegroundMagenta = '\\x1b[35m',
  _8_ForegroundCyan = '\\x1b[36m',
  _8_ForegroundWhite = '\\x1b[37m',
  _8_BackgroundBlack = '\\x1b[40m',
  _8_BackgroundRed = '\\x1b[41m',
  _8_BackgroundGreen = '\\x1b[42m',
  _8_BackgroundYellow = '\\x1b[43m',
  _8_BackgroundBlue = '\\x1b[44m',
  _8_BackgroundMagenta = '\\x1b[45m',
  _8_BackgroundCyan = '\\x1b[46m',
  _8_BackgroundWhite = '\\x1b[47m',
  _256_ForegroundDullGreen29 = '\\x1B[38;5;29m',
  _256_ForegroundOrange208 = '\\x1B[38;5;208m'
}

type ColorCombo = `${Color}${Color}`;

const combo: ColorCombo = `${Color._8_BackgroundGreen}${Color._8_BackgroundBlue}`;


// export type LogLevel = 'error'|'warn'|'info'|'debug'|'finer';


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


export type ColorScheme = { foreground: Color, background: Color };


export type ColorSchemes = {
  [key in keyof LogLevel]: ColorScheme;
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
      foreground: Color._8_BackgroundGreen,
      background: Color._8_BackgroundBlack
    },
    warn: {
      foreground: Color._8_ForegroundYellow,
      background: Color._8_BackgroundBlack
    },
    error: {
      foreground: Color._8_ForegroundRed,
      background: Color._8_BackgroundBlack
    },
    trace: {
      foreground: Color._8_ForegroundRed,
      background: Color._8_BackgroundBlack
    },
    debug: {
      foreground: Color._8_ForegroundBlue,
      background: Color._8_BackgroundBlack
    }
  }
};


export class Log {
  protected logLevel: LogLevelKey;

  protected foreground = Color._8_ForegroundGreen;
  protected background = Color._8_BackgroundBlack;

  constructor() {
    this.logLevel = logConfig.level ?? 'info';
  }


  protected get logLevelValue(): number {
    return logLevelValues[this.logLevel];
  }

  /**
   * Get the color string
   * @param colorScheme {LogLevel}
   */
  protected color(colorScheme): ColorCombo {
    let foreground = this.foreground, background = this.background;
    if (colorScheme) {
      foreground = logConfig?.colorSchemes[colorScheme]?.foreground ?? Color._8_ForegroundGreen;
      background = logConfig?.colorSchemes[colorScheme]?.background ?? Color._8_BackgroundBlack;
    }

    return `${foreground}${background}`;
  }
  error(data) {
    if (data && this.logLevelValue <= logLevelValues.error){
      this.errorImpl(data, 'error', logConfig.colorSchemes.error);
    }
  }

  trace(data) {
    if (data && this.logLevelValue <= logLevelValues.trace) {
      this.errorImpl(data, 'trace', logConfig.colorSchemes.trace);
    }
  }

  warn(data) {
    if (data && this.logLevelValue <= logLevelValues.warn)  {
      this.errorImpl(data, 'warn', logConfig.colorSchemes.warn);
    }
  }

  errorImpl(data: string | any, logMethod, colorScheme) {
    if (typeof data === 'string') {
      data = this.color(colorScheme) + data + ConsoleCode.Reset;
      console[logMethod](data);
    } else if (data && data instanceof Error) {
      if (data.stack) {
        data.stack = data.stack.replaceAll(' at', this.color(colorScheme) + ' at') + LogColor.Reset;
      }
      console[logMethod](this.color(colorScheme));
      console[logMethod](data);
      console[logMethod](ConsoleCode.Reset);
    } else {
      console[logMethod](inspect(data, false, 10, true));
    }
  }

  log(data, logMethod, colorScheme) {
    if (typeof data === 'string') {
      data = this.color(colorScheme) + data + ConsoleCode.Reset;
      console[logMethod](data);
    } else {
      console[logMethod](inspect(data, false, 10, true));
    }
  }

  info(data) {
    if (data && (this.logLevelValue <= logLevelValues.info)) {
      this.log(data, 'info', logConfig.colorSchemes.info);
    }
  }

  debug(data, colorScheme) {
    if (data && (this.logLevelValue <= logLevelValues.debug)) {
      this.log(data, 'debug', logConfig.colorSchemes.debug);
    }
  }
}

/*
export class BuildLog extends Log {
  static Tab = '   ';
  static Dots = '...';

  #contexts = [];
  #currentTask = undefined;

  constructor() {
    super();

  }

  get prefix() {
    let prefix = this.#currentTask ? BuildLog.Tab : '';
    for (let i = 0; i < this.#contexts.length; i++) {
      prefix = BuildLog.Tab + prefix;
    }
    return prefix;
  }

  start(context) {
    if (!context) {
      throw new Error('Missing context');
    }
    super.info(`${this.prefix}starting ${context}${BuildLog.Dots}`);
    this.#contexts.push(context);
  }

  end(success) {
    let context = this.#contexts.pop();
    if (success) {
      super.info(`${this.prefix}${BuildLog.Dots}completed ${context}`);
    } else {
      super.info(`${this.prefix}${BuildLog.Dots}ending ${context}`, LogLevels.error);
    }
  }

  startTask(name) {
    this.info(`executing ${name}${BuildLog.Dots}`);
    this.#currentTask = name;
  }

  endTask(success) {
    let task = this.#currentTask;
    this.#currentTask = undefined;
    if (success) {
      this.info(`${BuildLog.Dots}executed ${task}`);
    } else {
      this.info(`${BuildLog.Dots}${task} error`, LogLevels.error);
    }
  }

  error(data, colorScheme) {
    let message = data;
    if (typeof data === 'string') {
      message = `${this.prefix}${data}`;
    }
    super.error(message, colorScheme);
  }

  warn(data, colorScheme) {
    let message = data;
    if (typeof data === 'string') {
      message = `${this.prefix}${data}`;
    }
    super.warn(message, colorScheme);
  }

  info(data, colorScheme) {
    let message = data;
    if (typeof data === 'string') {
      message = `${this.prefix}${data}`;
    }
    super.info(message, colorScheme);
  }

  debug(data, colorScheme) {
    let message = data;
    if (typeof data === 'string') {
      message = `${this.prefix}${data}`;
    }
    super.debug(message, colorScheme);
  }

  finer(data, colorScheme) {
    let message = data;
    if (typeof data === 'string') {
      message = `${this.prefix}${data}`;
    }
    super.finer(message, colorScheme);
  }
}


 */
