/*
Created by Franz Zemen 12/23/2022
License Type: MIT
*/

import {inspect} from 'node:util';
import {Log, LogLevel} from './log.js';

type NeverError<T> = T extends Error ? never : T;

export class NestedLog {
  static Tab = '   ';

  static InspectDepth: 10;

  protected _log: Log = new Log();


  constructor(public depth:number, protected infoScheme?: keyof LogLevel | string) {
  }

  get logger(): Log {
    return this._log;
  }

  protected get prefix(): string {
    return NestedLog.Tab.repeat(this.depth);
  }


  error(err: Error | string) {
    if (typeof err === 'string') {
      this.logger.error(`${this.prefix}${err}`);
    } else {
      this.logger.error(err);
    }

  }

  warn(data: NeverError<any>) {
    if (typeof data === 'string') {
      this.logger.warn(`${this.prefix}${data}`);
    } else {
      this.logger.warn(`${this.prefix}${inspect(data, false, NestedLog.InspectDepth, true)}`);
    }
  }

  info(data: NeverError<any>, scheme?: keyof LogLevel | string) {
    this.#write(data, scheme, 'info');
  }

  debug(data: NeverError<any>, scheme?: keyof LogLevel | string) {
    this.#write(data, scheme, 'debug');
  }

  #write(data: NeverError<any>, scheme?: keyof LogLevel | string, method: 'info' | 'debug' = 'info') {
    if(!scheme) {
      scheme = this.infoScheme;
    }
    let message = data;
    if (typeof data === 'string') {
      message = `${this.prefix}${data}`;
    } else {
      message = `${this.prefix}${inspect(data, false, NestedLog.InspectDepth, true)}`;
    }
    if(scheme && scheme !== method) {
      this.logger.log(message, method, scheme);
    } else {
      this.logger[method](message);
    }
  }
}

