import { Transform, TransformConstructor } from '../../transform/index.js';
import { Pipeline } from './pipeline.js';
export declare class TransformPipe<PASSED_IN, PIPE_IN, PIPE_OUT> {
    protected _transform: Transform<PASSED_IN, PIPE_IN, PIPE_OUT>;
    protected payloadOverride: PASSED_IN | undefined;
    protected constructor(_transform: Transform<PASSED_IN, PIPE_IN, PIPE_OUT>, passedIn?: PASSED_IN);
    static transform<TRANSFORM_CLASS extends Transform<any, any, any>, PASSED_IN, PIPE_IN, PIPE_OUT = PIPE_IN>(transformClass: TransformConstructor<TRANSFORM_CLASS>, pipeline: Pipeline<any, any>, payloadOverride?: PASSED_IN): TransformPipe<PASSED_IN, PIPE_IN, PIPE_OUT>;
    get transformName(): string;
    execute(passedIn: PIPE_IN): Promise<PIPE_OUT>;
}
