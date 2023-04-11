/*
Created by Franz Zemen 04/05/2023
License Type: MIT
*/
import {buildPipeline} from 'dual-build/build';
import {processUnknownError} from 'dual-build/project';

buildPipeline
  .execute(undefined)
  .catch((err: unknown) => {
    processUnknownError(err, console, 'Unknown error');
  });
