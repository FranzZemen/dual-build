/*
Created by Franz Zemen 01/10/2023
License Type:
*/
import { Pipeline } from '../../../pipeline/index.js';
import { TransformPayload } from '../../transform-payload.js';
import { TargetEnvTsConfigTransform } from './target-env-ts-config.transform.js';
export class TargetEnvTsConfigsTransform extends TransformPayload {
    constructor(depth) {
        super(depth);
    }
    async executeImplPayload(passedIn) {
        if (!passedIn) {
            throw new Error('Undefined payload');
        }
        else {
            const pipeline = Pipeline
                .options({ name: 'Environment specific tsconfig json files', logDepth: this.logDepth });
            let parallelPipe;
            passedIn.targetOptions.options.forEach((targetOption, ndx) => {
                if (ndx === 0) {
                    parallelPipe = pipeline.startParallel(TargetEnvTsConfigTransform, { targetOption, path: passedIn.path });
                }
                else if (ndx === passedIn.targetOptions.options.length - 1) {
                    parallelPipe.endParallel(TargetEnvTsConfigTransform, ['void'], { targetOption, path: passedIn.path });
                }
                else {
                    parallelPipe.parallel(TargetEnvTsConfigTransform, {
                        targetOption, path: passedIn.path
                    });
                }
            });
            return pipeline.execute();
        }
    }
    transformContext(pipeIn, passedIn) {
        return ``;
    }
}
