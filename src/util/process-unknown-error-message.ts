/*
Created by Franz Zemen 12/24/2022
License Type: MIT
*/

import {inspect} from 'node:util';


export function processUnknownError(err: unknown): Error {
  if(err instanceof  Error) {
    return err;
  } else {
    return new Error (processUnknownErrorMessage(err));
  }
}

export function processUnknownErrorMessage(err: unknown): string {
  if(err instanceof Error) {
      return err.message;
  } else if (typeof err === 'object') {
    return inspect(err, false, 10, true);
  } else if (typeof err === 'string') {
    return err;
  } else if (typeof err === 'function') {
    return 'function'
  } else if (typeof err === 'bigint' || typeof err === 'number') {
    return err.toString(10);
  } else if (typeof err === 'boolean') {
    return '' + err;
  } else if (typeof err === 'symbol') {
    return err.toString();
  } else  {
    return 'undefined';
  }
}
