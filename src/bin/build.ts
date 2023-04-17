/*
Created by Franz Zemen 04/05/2023
License Type: MIT
*/


import {BuildPipelineType, getBuildPipeline} from 'dual-build/build';
import {processUnknownError} from 'dual-build/project';

getBuildPipeline(BuildPipelineType.Build)
  .execute(undefined)
  .catch((err:unknown) => {
    processUnknownError(err, console, 'Unknown error');
  });

/*
import {publishPipeline} from 'dual-build/build';
import {processUnknownError} from 'dual-build/project';

publishPipeline
  .execute(undefined)
  .catch((err: unknown) => {
    processUnknownError(err, console, 'Unknown error');
  });


 */
