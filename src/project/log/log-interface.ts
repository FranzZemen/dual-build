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

export type NamedScheme = 'task-internal' | 'task-detail' | 'task-done' | 'pipeline' | 'context';

export type TreatmentName = keyof LogLevel | NamedScheme | 'no-treatment';

export type Treatment = {
  foreground: ForegroundColor,
  background: BackgroundColor,
  prefix?: string,
  suffix?: string
};

export type Treatments = {
  [key in TreatmentName]: Treatment;
};

export interface LogInterface {
  debug(data: any, treatment?: TreatmentName): void;

  error(data: Error | string): void;

  info(data: any, treatment?: TreatmentName): void;

  log(data: any, logMethod: keyof Exclude<LogLevel, 'trace | error | warn'>, treatment: TreatmentName): void;

  trace(data: any): void;

  warn(data: any): void;
}
