/*
Created by Franz Zemen 12/24/2022
License Type: MIT
*/

import {LogInterface} from '../log/log-interface.js';
import {BuildError} from './build-error.js';


export function processUnknownError(err: unknown | Error | BuildError | {status: string, value: any | undefined, reason: any | undefined}[], log: LogInterface, message?: string): Error {
  if(err instanceof BuildError) {
    // Already processed
    return err;
  } else if (Array.isArray(err)) {
    // Represents a promise.allSettled error
    const errors: BuildError[] = [];
    err.forEach(result => {
      if(result.status === 'rejected') {
        errors.push(processUnknownError(result.reason, log));
      }
    });
    return new BuildError('Promise.allSettled Error, logs posted',{cause: errors});
  } else {
    message = processUnknownErrorMessage(err);
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
