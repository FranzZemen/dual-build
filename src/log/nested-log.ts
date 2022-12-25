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
    if(!scheme) {
      scheme = this.infoScheme;
    }
    let message: string;
    if (typeof data === 'string') {
      message = `${this.prefix}${data}`;
    } else {
      message = `${this.prefix}${inspect(data, false, NestedLog.InspectDepth, true)}`;
    }
    if(scheme && scheme !== 'info') {
      this.logger.log(message, 'info', scheme);
    } else {
      this.logger.info(message);
    }
  }

  debug(data: NeverError<any>, scheme?: keyof LogLevel | string) {
    if(!scheme) {
      scheme = this.infoScheme;
    }
    let message = data;
    if (typeof data === 'string') {
      message = `${this.prefix}${data}`;
    } else {
      message = `${this.prefix}${inspect(data, false, NestedLog.InspectDepth, true)}`;
    }
    if(scheme && scheme !== 'debug') {
      this.logger.log(message, 'debug', scheme);
    } else {
      this.logger.debug(message);
    }
  }
}

