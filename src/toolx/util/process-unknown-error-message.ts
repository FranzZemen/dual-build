/*
Created by Franz Zemen 12/24/2022
License Type: MIT
*/

import {inspect} from 'node:util';
import {Log} from '../log/log.js';
import {BuildError} from './build-error.js';


export function processUnknownError(err: unknown, log?: Log, message?: string): Error {
  if(err instanceof BuildError) {
    return err;
  } else {
    message = message ?? processUnknownErrorMessage(err);
    const error = new BuildError(message, {cause: err});
    if(log) {
      log.error(error);
    }
    return error;
  }
}

export function processUnknownErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message
  } else if (typeof err === 'string') {
    return err;
  }  else if (typeof err === 'function') {
    return 'function'
  } else if (typeof err === 'bigint' || typeof err === 'number') {
    return err.toString(10);
  } else if (typeof err === 'boolean') {
    return '' + err;
  } else if (typeof err === 'symbol') {
    return err.toString();
  } else  {
    return 'unknown error';
  }
}
