/*
Created by Franz Zemen 11/25/2022
License Type: 
*/
import {inspect} from 'node:util';
import process from 'node:process';
import {Logger} from './logger.js';

export class BuildProgress {
  constructor(private log: Logger) {
  }

  infoInspect(message, data) {
    this.log.info(message + inspect(data, false, 10, true));
  }

  error(data: any) {
    this.log.error(data);
  }

  fatalError(err: Error) {
    this.log.error(err);
    process.exit(99);
  }
}
