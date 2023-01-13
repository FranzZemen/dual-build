/**
 * A minimal feature console logger
 * @module build-tools/log
 * @author Franz zemen
 * @licence MIT
 */
import EventEmitter from 'events';
import {Console} from 'node:console';
import {Writable} from 'node:stream';
import {inspect} from 'node:util';

export enum ConsoleCode {
  //  ref = 'https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797#colors--graphics-mode',
  Reset      = '\x1b[0m',
  Bright     = '\x1b[1m',
  Dim        = '\x1b[2m',
  Underscore = '\x1b[4m',
  Blink      = '\x1b[5m',
  Reverse    = '\x1b[7m',
  Hidden     = '\x1b[8m',
}

export enum ForegroundColor {
  // ref = 'https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797#colors--graphics-mode',
  _8_ForegroundBlack         = '\x1b[30m',
  _8_ForegroundRed           = '\x1b[31m',
  _8_ForegroundGreen         = '\x1b[32m',
  _8_ForegroundYellow        = '\x1b[33m',
  _8_ForegroundBlue          = '\x1b[34m',
  _8_ForegroundMagenta       = '\x1b[35m',
  _8_ForegroundCyan          = '\x1b[36m',//console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan
  _8_ForegroundWhite         = '\x1b[37m',
  _256_ForegroundBlueish27   = '\x1b[38;5;27m',
  _256_ForegroundDullGreen29 = '\x1B[38;5;29m',
  _256_ForegroundGrayish101  = '\x1B[38;5;101m',
  _256_ForegroundOrange208   = '\x1B[38;5;208m'
}

export enum BackgroundColor {
  _8_BackgroundBlack         = '\x1b[40m',
  _8_BackgroundRed           = '\x1b[41m',
  _8_BackgroundGreen         = '\x1b[42m',
  _8_BackgroundYellow        = '\x1b[43m',
  _8_BackgroundBlue          = '\x1b[44m',
  _8_BackgroundMagenta       = '\x1b[45m',
  _8_BackgroundCyan          = '\x1b[46m',
  _8_BackgroundWhite         = '\x1b[47m',
  _256_Blueish27             = '\x1b[48;5;27m',
  _256_BackgroundGrayish101  = '\x1B[48;5;101m',
  _256_BackgroundDullGreen29 = '\x1B[48;5;29m',
  _256_BackgroundOrange208   = '\x1B[48;5;208m'

};

export enum utf8SpecialCharacters {
  RighwardsArrow  = '\u2192',
  WhiteRightArrow = '\u21E8',
  WhiteHeavyCheckMark = '\u2705',
  HeavyCheckmark  = '\u2714'
}

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

export type NamedScheme = 'task-internal' | 'task-detail' | 'task-done' | 'pipeline';

export type TreatmentName = keyof LogLevel | NamedScheme

export type Treatment = {
  foreground: ForegroundColor,
  background: BackgroundColor,
  prefix?: string,
  suffix?: string
};


export type Treatments = {
  [key in TreatmentName]: Treatment;
};

export type LogConfig = {
  level: LogLevelKey,
  treatments: Treatments
}

/**
 * Log configuration object
 * @property {string} level     - The log level
 * @type {{treatments: {warn: {background: string, foreground: string}, finer: {background: string, foreground: string}, debug: {background:
 *   string, foreground: string}, none: {background: string, foreground: string}, error: {background: string, foreground: string}, info: {background:
 *   string, foreground: string}}, level: string}}
 */
export let logConfig: LogConfig = {
  level: 'info',
  treatments: {
    // Default log level schemes
    info: {
      foreground: ForegroundColor._256_ForegroundDullGreen29,
      background: BackgroundColor._8_BackgroundBlack
    },
    warn: {
      foreground: ForegroundColor._8_ForegroundYellow,
      background: BackgroundColor._8_BackgroundBlack,
      prefix: `${BackgroundColor._8_BackgroundBlack}${ForegroundColor._8_ForegroundYellow}${ConsoleCode.Bright}${ConsoleCode.Blink}!${ConsoleCode.Reset} `
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
    'task-done': {
      foreground: ForegroundColor._256_ForegroundDullGreen29,
      background: BackgroundColor._8_BackgroundBlack,
      //suffix:`
      // ${BackgroundColor._8_BackgroundBlack}${ForegroundColor._256_ForegroundDullGreen29}${ConsoleCode.Bright}${utf8SpecialCharacters.WhiteHeavyCheckMark}${ConsoleCode.Reset}`
    },
    'task-internal': {
      foreground: ForegroundColor._256_ForegroundDullGreen29,
      background: BackgroundColor._8_BackgroundBlack,
      prefix:  `${utf8SpecialCharacters.RighwardsArrow} `
      // prefix:
      // `${BackgroundColor._8_BackgroundBlack}${ForegroundColor._8_ForegroundWhite}${ConsoleCode.Bright}${utf8SpecialCharacters.RighwardsArrow}${ConsoleCode.Reset} `
    },
    'task-detail': {
      foreground: ForegroundColor._256_ForegroundGrayish101,
      background: BackgroundColor._8_BackgroundBlack
    },
    'pipeline': {
      foreground: ForegroundColor._8_ForegroundWhite,
      background: BackgroundColor._8_BackgroundBlack
    }
  }
};

export type NeverType<T, Type> = T extends Type ? never : T;

export type ConsoleListener = () => string;

export class EmittingConsole extends EventEmitter {
  private readonly _console: Console;

  constructor() {
    super();
    this._console = new Console({
                                  stdout: this.initWriteable('stdout'),
                                  stderr: this.initWriteable('stderr')
                                });
  }

  public get console(): Console {
    return this._console;
  }

  private initWriteable(event: string): Writable {
    let self = this;
    return new Writable({
                          write(
                            chunk: any,
                            encoding: BufferEncoding,
                            callback: (error?: Error | null) => void): void {
                            self.emit(event, (chunk as Buffer).toString('utf-8'));
                            callback();
                          },
                          writev(
                            chunks: Array<{ chunk: any; encoding: BufferEncoding }>,
                            callback: (error?: Error | null) => void): void {
                            chunks.forEach(chunk => self.emit(event, (chunk.chunk as Buffer).toString('utf-8')));
                            callback();
                          }
                        });
  }
}

const noOptWriteable = new Writable({
                                      write(
                                        chunk: any,
                                        encoding: BufferEncoding,
                                        callback: (error?: Error | null) => void): void {
                                        callback();
                                      },
                                      writev(
                                        chunks: Array<{ chunk: any; encoding: BufferEncoding }>,
                                        callback: (error?: Error | null) => void): void {
                                        callback();
                                      }
                                    });
export const no_console = new Console({
                                        stdout: noOptWriteable,
                                        stderr: noOptWriteable
                                      });


export class Log {
  static TabLength = 2;
  static Tab = ' '.repeat(Log.TabLength);
  static InspectDepth: 10;
  private static console: Console = console;
  protected logLevel: LogLevelKey;
  protected foreground = ForegroundColor._8_ForegroundGreen;
  protected background = BackgroundColor._8_BackgroundBlack;

  constructor(public depth = 0, protected maxDigestSize = 1000) {
    this.logLevel = logConfig.level ?? 'info';
  }

  protected get logLevelValue(): number {
    return logLevelValues[this.logLevel];
  }

  public static setConsole(console: Console) {Log.console = console;};

  public static resetConsole() {Log.console = console;};



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

  info(data: any, treatment?: TreatmentName) {
    if (data && this.logLevelValue <= logLevelValues.info) {
      this._log(data, 'info', treatment ? treatment : 'info');
    }
  }

  debug(data: any, treatment?: TreatmentName) {
    if (data && this.logLevelValue <= logLevelValues.debug) {
      this._log(data, 'debug', treatment ? treatment : 'debug');
    }
  }

  /**
   * Logs anything at the info or debug level leveraging a custom colorScheme.  Otherwise use the dedicated methods.  This
   * is only enforced at the typescript level, so if you really, really want to you can override with ts-ignore or use javascript.
   * The enforcement is for good design, no side effects on go around
   * @param data
   * @param logMethod
   * @param treatment
   */
  log(data: any, logMethod: keyof Exclude<LogLevel, 'trace | error | warn'>, treatment: TreatmentName) {
    this._log(data, logMethod, treatment);
  }

  /**
   * Get the color string
   * @param treatment {LogLevel}
   */
  protected color(treatment: TreatmentName): string {
    let foreground = this.foreground, background = this.background;
    if (treatment) {
      foreground = logConfig?.treatments[treatment]?.foreground ?? ForegroundColor._8_ForegroundGreen;
      background = logConfig?.treatments[treatment]?.background ?? BackgroundColor._8_BackgroundBlack;
    }

    return foreground + background;
  }

  protected errorImpl(data: string | any, logMethodAndScheme: keyof LogLevel) {
    if (typeof data === 'string') {
      data = this.assembleStringMessage(data, logMethodAndScheme);
      Log.console[logMethodAndScheme](data);
    } else if (data && data instanceof Error) {
      if (data.stack) {
        data.stack = data.stack.replaceAll(' at', this.color(logMethodAndScheme) + ' at') + ConsoleCode.Reset;
      }
      Log.console[logMethodAndScheme](this.color(logMethodAndScheme));
      Log.console[logMethodAndScheme](data);
      Log.console[logMethodAndScheme](ConsoleCode.Reset);
    } else {
      Log.console[logMethodAndScheme](this.inspect(data));
    }
  }

  protected _log(data: any, logMethod: keyof LogLevel, treatment: TreatmentName) {
    if (typeof data === 'string') {
      data = this.assembleStringMessage(data, treatment);
      Log.console.log(data);
    } else {
      Log.console[logMethod](this.inspect(data));
    }
  }
  private assembleStringMessage(message: string, treatment: TreatmentName): string {
    return Log.Tab.repeat(this.depth)
      + (logConfig.treatments[treatment].prefix ? logConfig.treatments[treatment].prefix + ConsoleCode.Reset : '')
      + this.color(treatment) + message
      + ConsoleCode.Reset
      + (logConfig.treatments[treatment].suffix ? logConfig.treatments[treatment].suffix + ConsoleCode.Reset: '');
  }

  private inspect(data : any) {
    return Log.Tab.repeat(this.depth + 1) + inspect(data, false, Log.InspectDepth, true).replaceAll('\n', '\n' + Log.Tab.repeat(this.depth + 1));
  }
}


