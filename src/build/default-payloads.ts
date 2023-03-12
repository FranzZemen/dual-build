/*
Created by Franz Zemen 02/08/2023
License Type: 
*/

import {ExecutablePayload} from '../project/index.js';

export const transpilePayload: ExecutablePayload = {
  executable: 'npx tsc',
  cwd: './',
  arguments: ['-b'],
  batchTarget: false,
  synchronous: false
}

export const publishPayload: ExecutablePayload = {
  executable: 'npm publish',
  cwd: './',
  arguments: ['./out/dist'],
  batchTarget: false,
  synchronous: false
}


