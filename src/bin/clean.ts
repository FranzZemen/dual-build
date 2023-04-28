/*
Created by Franz Zemen 04/05/2023
License Type: 
*/

import {BuildPipelineType, getBuildPipeline} from 'dual-build/build';
import {processUnknownError} from 'dual-build/project';

getBuildPipeline(BuildPipelineType.Clean)
  .execute(undefined)
  .catch((err:unknown) => {
    processUnknownError(err, console, 'Unknown error');
  });
