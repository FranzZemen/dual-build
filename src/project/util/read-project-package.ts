/*
Created by Franz Zemen 05/05/2023
License Type: MIT
*/

import {Package} from '../options/index.js';
import {isT, readFileAsJson} from './read-file-as-json.js';

// TODO - add validation
export const packageValidator: isT<Package> = (t: Package | any): t is Package => {return true};

export function readProjectPackage(): Promise<Package> {
  return readFileAsJson( './package.json', packageValidator)
}
