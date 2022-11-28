/*
Created by Franz Zemen 11/25/2022
License Type: MIT
*/

import {inspect} from 'node:util';
import {exitCode} from './exit-codes.js';

/**
 * A basic logger interface; for this project a subset of standard logging functions.
 */
export interface Logger {
  error(data: any, ...args);
  warn(data: any, ...args);
  info(data: any, ...args);
  debug(data: any, ...args);
  infoInspect(message: string, data: any);
  fatalError(err: Error);
}


export class DefaultLogger implements Logger {

  error(data: any, ...args) {
    console.error(data, args);
  }
  warn(data: any, ...args) {
    console.warn(data, args);
  }
  info(data: any, ...args) {
    console.info(data, args);
  }
  debug(data: any, ...args) {
    console.debug(data, ...args);
  }
  infoInspect(message: string, data: any) {
    console.info(message);
    console.info(data);
  }
  fatalError(err: Error) {
    console.error(err);
    process.exit(exitCode['Fatal Error']);
  }
}


export class BuildProgress extends DefaultLogger {
  constructor() {
    super()
  }

  infoInspect(message, data) {
    super.info(message + inspect(data, false, 10, true));
  }

  error(data: any) {
    super.error(data);
  }

  fatalError(err: Error) {
    super.error(err);
    process.exit(exitCode['Fatal Error']);
  }

  debug(data: any, ...args) {
    super.debug(data,...args);
  }

  info(data: any, ...args) {
    super.info(data, ...args);
  }

  warn(data: any, ...args) {
    super.warn(data, ...args);
  }
}
