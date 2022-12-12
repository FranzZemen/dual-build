/*
Created by Franz Zemen 12/03/2022
License Type: 
*/

import {Readable, Duplex, Transform, Writable} from 'node:stream';
import {Options} from '../options/options.js';


export type Payload<OptionsType extends Options> = {
  options: OptionsType;
}

export interface Action<ExecuteReturnType> {
 execute(): ExecuteReturnType;
}

export abstract class ReadableAction<ExecuteReturnType, ConfigOptionsType> extends Readable implements Action<ExecuteReturnType> {
  protected constructor() {
    super({objectMode: true});
  }
  abstract execute(): ExecuteReturnType;
}

export abstract class WriteableAction<ExecuteReturnType, ConfigOptionsType> extends Writable implements Action<ExecuteReturnType> {
  protected constructor() {
    super({objectMode: true});
  }
  abstract execute(): ExecuteReturnType;
}

export abstract class DuplexAction<ExecuteReturnType> extends Duplex implements Action<ExecuteReturnType> {
  protected constructor() {
    super({objectMode: true});
  }
  abstract execute(): ExecuteReturnType;
}

export abstract class TransformAction<ExecuteReturnType> extends Transform implements Action<ExecuteReturnType> {
  protected constructor() {
    super({objectMode: true});
  }
  abstract execute(): ExecuteReturnType;
}

export abstract class PromisedAction<ExecuteReturnType> implements Action<ExecuteReturnType> {
  abstract execute(): ExecuteReturnType;
}


export type ActionStreamHookFunction<ExecuteReturnType extends Array<any>> = (...args: ExecuteReturnType) => void;


export type ActionOptions = {
  beforeStart?:ActionStreamHookFunction<undefined>;
  onCreateError?: ActionStreamHookFunction<[error: Error]>
}

export function ActionComponent<ExecuteReturnType extends ActionOptions>(options: ExecuteReturnType) {
  return function (constructor: Function) {
    constructor.prototype.options = options;
  };
}



