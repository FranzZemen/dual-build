import { Log } from '../../log/log.js';
import { Transform, TransformConstructor } from '../../transform/index.js';
import { Pipeline } from './pipeline.js';
export type MergeFunction<T> = (parallelPayloads: any[]) => Promise<T>;
export type MergeType = 'void' | 'asAttributes' | 'asMerged' | 'asMergeFunction' | 'asPipedIn';
export declare class ParallelPipe<PARALLEL_IN, PARALLEL_OUT = PARALLEL_IN> {
    protected _pipeline: Pipeline<any, any>;
    log: Log;
    protected _pipe: [transform: Transform<any, any, any>, payloadOverride: any][];
    protected _mergeStrategy: [mergeType: MergeType, mergeFunction?: MergeFunction<PARALLEL_OUT>];
    protected _mergeFunction: MergeFunction<PARALLEL_OUT> | undefined;
    protected constructor(_pipeline: Pipeline<any, any>, depth: number);
    static start<TRANSFORM_CLASS extends Transform<any, any, any>, PASSED_IN, PARALLEL_IN, PARALLEL_OUT = PARALLEL_IN>(transformClass: TransformConstructor<TRANSFORM_CLASS>, pipeline: Pipeline<any, any>, payloadOverride?: PASSED_IN): ParallelPipe<PARALLEL_IN, PARALLEL_OUT>;
    parallel<TRANSFORM_CLASS extends Transform<any, any, any>, PASSED_IN = undefined>(transformClass: TransformConstructor<TRANSFORM_CLASS>, payloadOverride?: PASSED_IN): ParallelPipe<PARALLEL_IN, PARALLEL_OUT>;
    endParallel<TRANSFORM_CLASS extends Transform<any, any, any>, PASSED_IN = undefined>(transformClass: TransformConstructor<TRANSFORM_CLASS>, mergeStrategy?: [mergeType: MergeType, mergeFunction?: MergeFunction<PARALLEL_OUT>], payloadOverride?: any): Pipeline<any, any>;
    execute(payload: PARALLEL_IN): Promise<PARALLEL_OUT>;
}
