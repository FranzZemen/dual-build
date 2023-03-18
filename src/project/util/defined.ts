/*
Created by Franz Zemen 03/18/2023
License Type: MIT
*/

import {BuildError, BuildErrorNumber} from './build-error.js';

export function defined<T>(it:T | undefined): it is T {
  if(it === undefined) {
    throw new BuildError('Unexpected undefined', undefined, BuildErrorNumber.Undefined);
  }
  return true;
}
