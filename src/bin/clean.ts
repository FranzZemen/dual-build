/*
Created by Franz Zemen 04/05/2023
License Type: 
*/

import {cleanPipeline} from 'dual-build/build';
import {processUnknownError} from 'dual-build/project';

cleanPipeline
  .execute(undefined)
  .catch((err: unknown) => {
    processUnknownError(err, console, 'Unknown error');
  });
