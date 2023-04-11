/*
Created by Franz Zemen 01/10/2023
License Type: 
*/

import {TargetOptions} from '../../../../options/index.js';
import {ParallelPipe, Pipeline} from '../../../../pipeline/index.js';
import {TransformPayload} from '../../../../transform/transform-payload.js';
import {GenerateTsConfigPayload, TargetEnvTsConfigTransform} from './target-env-ts-config.transform.js';


export type GenerateTsConfigsPayload = {
  path: string;
  targetOptions: TargetOptions;
}


export class TargetEnvTsConfigsTransform extends TransformPayload<GenerateTsConfigsPayload> {
  constructor(depth: number) {
    super(depth);
  }

  public async executeImplPayload(passedIn: GenerateTsConfigsPayload | undefined): Promise<void> {
    if (!passedIn) {
      throw new Error('Undefined payload');
    } else {
      const pipeline: Pipeline<void, void> = Pipeline
        .options<void, void>({name: 'Environment specific tsconfig json files', logDepth: this.logDepth});
      let parallelPipe: ParallelPipe<void, void>;
      passedIn.targetOptions.options.forEach((targetOption, ndx) => {
        if (ndx === 0) {
          parallelPipe = pipeline.startParallel<
            TargetEnvTsConfigTransform, GenerateTsConfigPayload, void, void>
                                 (TargetEnvTsConfigTransform,
                                  {targetOption, path: passedIn.path});
        } else if (ndx === passedIn.targetOptions.options.length - 1) {
          parallelPipe.endParallel<
            TargetEnvTsConfigTransform, GenerateTsConfigPayload>
                      (TargetEnvTsConfigTransform,
                       ['void'], {targetOption, path: passedIn.path});
        } else {
          parallelPipe.parallel<
            TargetEnvTsConfigTransform, GenerateTsConfigPayload>
                      (TargetEnvTsConfigTransform,
                       {
                         targetOption, path: passedIn.path
                       });
        }
      });
      return pipeline.execute();
    }
  }

  public transformContext(pipeIn: undefined, passedIn: GenerateTsConfigsPayload | undefined): string {
    return ``;
  }
}
