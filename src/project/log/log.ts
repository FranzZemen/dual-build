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
import {defined} from '../util/defined.js';
import {BackgroundColor, ConsoleCode, ForegroundColor, utf8SpecialCharacters} from './console-types.js';
import {LogInterface, LogLevel, LogTreatmentName, Treatments} from './log-interface.js';

const logLevelValues: LogLevel = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  trace: 4
};

export type LogLevelKey = keyof LogLevel;

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
  level: 'debug',
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
      background: BackgroundColor._8_BackgroundBlack
      //suffix:`
      // ${BackgroundColor._8_BackgroundBlack}${ForegroundColor._256_ForegroundDullGreen29}${ConsoleCode.Bright}${utf8SpecialCharacters.WhiteHeavyCheckMark}${ConsoleCode.Reset}`
    },
    'task-internal': {
      foreground: ForegroundColor._256_ForegroundDullGreen29,
      background: BackgroundColor._8_BackgroundBlack,
      prefix: `${utf8SpecialCharacters.RighwardsArrow} `
      // prefix:
      // `${BackgroundColor._8_BackgroundBlack}${ForegroundColor._8_ForegroundWhite}${ConsoleCode.Bright}${utf8SpecialCharacters.RighwardsArrow}${ConsoleCode.Reset}
      // `
    },
    'task-detail': {
      foreground: ForegroundColor._256_ForegroundGrayish101,
      background: BackgroundColor._8_BackgroundBlack
    },
    'pipeline': {
      foreground: ForegroundColor._8_ForegroundWhite,
      background: BackgroundColor._8_BackgroundBlack
    },
    'context': {
      foreground: ForegroundColor._8_ForegroundCyan,
      background: BackgroundColor._8_BackgroundBlack
    },
    'no-treatment': { // Special treatment - these are dummy values
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

export type LogDataSegment = {
  data: any;
  treatment: LogTreatmentName
}

export class Log implements LogInterface {
  static TabLength = 2;
  static Tab = ' '.repeat(Log.TabLength);
  static InspectDepth = 10;
  private static defaultConsole: Console = new Console({stdout: process.stdout, stderr: process.stderr});
  private static originalDefaultConsole = Log.defaultConsole;
  public static setDefaultConsole(console: Console) {
    Log.defaultConsole = console
  }
  public static resetDefaultConsole() {
    Log.defaultConsole = Log.originalDefaultConsole;
  }
  // private console: Console = new Console({stdout: process.stdout, stderr: process.stderr});
  protected logLevel: LogLevelKey;
  protected foreground = ForegroundColor._8_ForegroundGreen;
  protected background = BackgroundColor._8_BackgroundBlack;

  constructor(public depth = 0, private console = Log.defaultConsole, private maxDigestSize = 1000) {
    this.logLevel = logConfig.level ?? 'info';
    /**
     * It might be expected to use console.group() instead of manually inserting tabs.  However, if one has multiple process.stdio consoles,
     * these group together, which is not the intended behavior.  Thus, we don't do this:
     *
     * for(let i = 0; i < depth; i++) console.group();
     */
  }

  protected get logLevelValue(): number {
    return logLevelValues[this.logLevel];
  }

  public setConsole(console: Console) {this.console = console;};

  // public resetConsole() {this.console = console;};


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

  info(data: any, treatment?: LogTreatmentName) {
    if (data && this.logLevelValue <= logLevelValues.info) {
      this._log(data, 'info', treatment ? treatment : 'info');
    }
  }

  infoSegments(dataSegments: LogDataSegment[], treatment: LogTreatmentName = 'info') {
    if (dataSegments && this.logLevelValue <= logLevelValues.info) {
      this._logSegments(dataSegments, 'info');
    }
  }

  debug(data: any, treatment?: LogTreatmentName) {
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
  log(data: any, logMethod: keyof Exclude<LogLevel, 'trace | error | warn'>, treatment: LogTreatmentName) {
    this._log(data, logMethod, treatment);
  }

  /**
   * Get the color string
   * @param treatment {LogLevel}
   */
  protected color(treatment: LogTreatmentName): string {
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
      this.console[logMethodAndScheme](data);
    } else if (data && data instanceof Error) {
      if (data.stack) {
        data.stack = data.stack.replaceAll(' at', `${this.color(logMethodAndScheme)} at`) + ConsoleCode.Reset;
      }
      this.console[logMethodAndScheme](this.color(logMethodAndScheme));
      this.console[logMethodAndScheme](data);
      this.console[logMethodAndScheme](ConsoleCode.Reset);
    } else {
      this.console[logMethodAndScheme](this.inspect(data));
    }
  }

  protected _logSegments(segments: LogDataSegment[], logMethod: keyof LogLevel): void {
    // Start the segment with the necessary depth
    let currText = Log.Tab.repeat(this.depth);
    for (let i = 0; i < segments.length; i++) {
      const nextSegment = segments[i];
      if (defined(nextSegment)) {
        if (typeof nextSegment.data === 'string') {

          if (nextSegment.data.indexOf(ConsoleCode.Escape) >= 0) {
            // Replace any newline with the appropriate newline + depth.  This must be done after the if(escape) because it inserts escapes
            nextSegment.data = nextSegment.data.replaceAll('\n', `\n${Log.Tab.repeat(this.depth)}`);
            // Add depth to any line that does not start with depth
            //
            currText += nextSegment.data;
          } else {
            // Replace any newline with the appropriate newline + depth
            nextSegment.data = nextSegment.data.replaceAll('\n', `\n${Log.Tab.repeat(this.depth)}`);
            currText += this.assembleStringMessage(nextSegment.data, nextSegment.treatment, false);
          }
        } else {
          if (currText.length > 0) {
            this.console.log(currText);
            // Reset with depth
            currText = Log.Tab.repeat(this.depth);
          }
          this.console[logMethod](this.inspect(nextSegment.data));
        }
      }
    }
    if (currText.length > 0) {
      this.console.log(currText);
      currText = '';
    }
  }

  protected _log(data: any, logMethod: keyof LogLevel, treatment: LogTreatmentName) {
    if (typeof data === 'string') {
      if (data.indexOf(ConsoleCode.Escape) < 0) {
        data = this.assembleStringMessage(data, treatment);
      }
      this.console.log(data);
    } else {
      this.console[logMethod](this.inspect(data));
    }
  }

  private assembleStringMessage(message: string, treatment: LogTreatmentName, standalone = true): string {
    const resetStr = logConfig.treatments[treatment].prefix ? logConfig.treatments[treatment].prefix + ConsoleCode.Reset : '';
    let result = standalone ? Log.Tab.repeat(this.depth) : '';
    result += resetStr;
    result += this.color(treatment) + message;
    result += ConsoleCode.Reset;
    result += resetStr;
    return result;
  }

  private inspect(data: any) {
    return Log.Tab.repeat(this.depth) + inspect(data, false, Log.InspectDepth, true).replaceAll('\n', '\n' + Log.Tab.repeat(this.depth));
  }
}


