/*
Created by Franz Zemen 12/10/2022
License Type: MIT
*/

import {writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {cwd} from 'node:process';
import {bootstrapOptions} from '../../options/bootstrap-options.js';
import {Options} from '../../options/options.js';
import {dotDualBuildPath} from '../constants.js';

export class OptionsWriterAction {
  constructor() {
  }

  write(options:Options) {
    writeFileSync(join(cwd(),dotDualBuildPath, options.filename), JSON.stringify(options), {encoding: 'utf8'});
  }
}

const writer = new OptionsWriterAction();
writer.write(bootstrapOptions);
