#!/usr/bin/env node

import {cwd} from 'node:process';
import {generate} from './generate-base-tsconfig/generate-base-tsconfig.js';

const currentWd = cwd();

if(currentWd.endsWith('dual-build')) {
  generate(currentWd);
} else {
  console.error(`cwd (${currentWd}) is not the project directory.  Re-run from project directory`);
}
