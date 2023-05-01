/*
Created by Franz Zemen 02/05/2023
License Type: MIT
*/

import {BackgroundColor, ForegroundColor} from './console-types.js';

export type LogLevel = {
  debug: 0;
  info: 1;
  warn: 2,
  error: 3;
  trace: 4;
};

export type NamedLogScheme = 'task-internal' | 'task-detail' | 'task-done' | 'pipeline' | 'context';

export type LogTreatmentName = keyof LogLevel | NamedLogScheme | 'no-treatment';

export type LogTreatment = {
  foreground: ForegroundColor,
  background: BackgroundColor,
  prefix?: string,
  suffix?: string
};

export type Treatments = {
  [key in LogTreatmentName]: LogTreatment;
};

export interface LogInterface {
  debug(data: any, treatment?: LogTreatmentName): void;

  error(data: Error | string): void;

  info(data: any, treatment?: LogTreatmentName): void;

  log(data: any, logMethod: keyof Exclude<LogLevel, 'trace | error | warn'>, treatment: LogTreatmentName): void;

  trace(data: any): void;

  warn(data: any): void;
}
