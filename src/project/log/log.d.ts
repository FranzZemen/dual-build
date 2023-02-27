/// <reference types="node" resolution-mode="require"/>
/**
 * A minimal feature console logger
 * @module build-tools/log
 * @author Franz zemen
 * @licence MIT
 */
import EventEmitter from 'events';
import { BackgroundColor, ForegroundColor } from './console-types.js';
import { LogInterface, LogLevel, TreatmentName, Treatments } from './log-interface.js';
export type LogLevelKey = keyof LogLevel;
export type LogConfig = {
    level: LogLevelKey;
    treatments: Treatments;
};
/**
 * Log configuration object
 * @property {string} level     - The log level
 * @type {{treatments: {warn: {background: string, foreground: string}, finer: {background: string, foreground: string}, debug: {background:
 *   string, foreground: string}, none: {background: string, foreground: string}, error: {background: string, foreground: string}, info: {background:
 *   string, foreground: string}}, level: string}}
 */
export declare let logConfig: LogConfig;
export type NeverType<T, Type> = T extends Type ? never : T;
export type ConsoleListener = () => string;
export declare class EmittingConsole extends EventEmitter {
    private readonly _console;
    constructor();
    get console(): Console;
    private initWriteable;
}
export declare const no_console: Console;
export declare class Log implements LogInterface {
    depth: number;
    protected maxDigestSize: number;
    static TabLength: number;
    static Tab: string;
    static InspectDepth: 10;
    private static console;
    protected logLevel: LogLevelKey;
    protected foreground: ForegroundColor;
    protected background: BackgroundColor;
    constructor(depth?: number, maxDigestSize?: number);
    protected get logLevelValue(): number;
    static setConsole(console: Console): void;
    static resetConsole(): void;
    error(data: Error | string): void;
    trace(data: any): void;
    warn(data: any): void;
    info(data: any, treatment?: TreatmentName): void;
    debug(data: any, treatment?: TreatmentName): void;
    /**
     * Logs anything at the info or debug level leveraging a custom colorScheme.  Otherwise use the dedicated methods.  This
     * is only enforced at the typescript level, so if you really, really want to you can override with ts-ignore or use javascript.
     * The enforcement is for good design, no side effects on go around
     * @param data
     * @param logMethod
     * @param treatment
     */
    log(data: any, logMethod: keyof Exclude<LogLevel, 'trace | error | warn'>, treatment: TreatmentName): void;
    /**
     * Get the color string
     * @param treatment {LogLevel}
     */
    protected color(treatment: TreatmentName): string;
    protected errorImpl(data: string | any, logMethodAndScheme: keyof LogLevel): void;
    protected _log(data: any, logMethod: keyof LogLevel, treatment: TreatmentName): void;
    private assembleStringMessage;
    private inspect;
}
