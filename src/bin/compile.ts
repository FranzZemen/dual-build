#!/usr/bin/env node
/*
Created by Franz Zemen 04/05/2023
License Type: 
*/

import {compilePipeline} from 'dual-build/build';
import {processUnknownError} from 'dual-build/project';

compilePipeline
  .execute(undefined)
  .catch((err: unknown) => {
    processUnknownError(err, console, 'Unknown error');
  });
