/*
Created by Franz Zemen 11/25/2022
License Type: MIT
*/

/**
 * A basic logger interface; for this project a subset of standard logging functions.
 */
export interface Logger {
  error(data: any, ...args);
  warn(data: any, ...args);
  info(data: any, ...args);
  debug(data: any, ...args);
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
}

