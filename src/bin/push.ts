
import {BuildPipelineType, getBuildPipeline} from 'dual-build/build';
import {processUnknownError} from 'dual-build/project';

getBuildPipeline(BuildPipelineType.Push)
  .execute(undefined)
  .catch((err:unknown) => {
    processUnknownError(err, console, 'Unknown error');
  });
