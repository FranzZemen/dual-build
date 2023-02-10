/*
Created by Franz Zemen 02/08/2023
License Type: 
*/

import {ExecutablePayload} from '../toolx/index.js';

export const transpilePayload: ExecutablePayload = {
  executable: 'npx tsc',
  cwd: './',
  arguments: ['-b'],
  batchTarget: false,
  synchronous: false
}


