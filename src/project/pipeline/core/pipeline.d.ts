import { Log } from '../../log/log.js';
import { Transform, TransformConstructor } from '../../transform/index.js';
import { MergeFunction, MergeType, ParallelPipe } from './parallel-pipe.js';
import { Pipe, PipelineOptions } from './pipeline-aliases.js';
import { SeriesPipe } from './series-pipe.js';
export type ArrayTwoOrMore<T> = [T, T, ...T[]];
export declare function defaultPipelineOptions(): PipelineOptions;
/**
 * PIPELINE_SERIES_AND_PIPE_IN = The payload starting the pipeline
 * PIPELINE_OUT = The payload coming out of the pipeline (by default the payload remains the same throughout
 */
export declare class Pipeline<PIPELINE_IN, PIPELINE_OUT = PIPELINE_IN> {
    protected static index: number;
    log: Log;
    name: string;
    protected _pipes: Pipe[];
    private constructor();
    /**
     * If this is not called, the defaultOptions function will be use.
     *
     * @param options
     */
    static options<PIPELINE_IN = undefined, PIPELINE_OUT = PIPELINE_IN>(options?: PipelineOptions): Pipeline<PIPELINE_IN, PIPELINE_OUT>;
    /**
     * Execute a single Transform
     *
     * By default, the pipeline payload flows without altereration, so unless a pipeline element changed the payload upstream or the transform changes
     * the output, the transform payload stays the same as the pipeline.  Otherwise the appropriate template types must be supplied
     *
     */
    transform<TRANSFORM_CLASS extends Transform<any, any, any>, PASSED_IN = undefined, PIPE_IN = PIPELINE_IN, PIPE_OUT = PIPE_IN>(transformClass: TransformConstructor<TRANSFORM_CLASS>, passedIn?: PASSED_IN): Pipeline<PIPELINE_IN, PIPELINE_OUT>;
    transforms(transformClasses: TransformConstructor<any> | TransformConstructor<any>[], passedIns?: any | any[]): Pipeline<PIPELINE_IN, PIPELINE_OUT>;
    /**
     * Start a series of transforms.  Default is for the pipeline payload to be maintained (not altered)
     */
    startSeries<TRANSFORM_CLASS extends Transform<any, any, any>, PASSED_IN = undefined, SERIES_IN = PIPELINE_IN, SERIES_OUT = PIPELINE_IN>(transformClass: TransformConstructor<TRANSFORM_CLASS>, passedIn?: PASSED_IN): SeriesPipe<SERIES_IN, SERIES_OUT>;
    /**
     * Continue the series, by default with the pipeline payload
     */
    series<SERIES_IN = PIPELINE_IN, SERIES_OUT = PIPELINE_IN>(transformClasses: TransformConstructor<any>[], passedIns: ArrayTwoOrMore<any | undefined>[]): Pipeline<PIPELINE_IN, PIPELINE_OUT>;
    /**
     * Start parallel transforms, defaulting to pipeline payload in and out (and appropriate merge flag)
     **/
    startParallel<TRANSFORM_CLASS extends Transform<any, any, any>, PASSED_IN = undefined, PARALLEL_IN = PIPELINE_IN, PARALLEL_OUT = PIPELINE_IN>(transformClass: TransformConstructor<TRANSFORM_CLASS>, passedIn?: PASSED_IN): ParallelPipe<PARALLEL_IN, PARALLEL_OUT>;
    parallels<PARALLEL_IN = PIPELINE_IN, PARALLEL_OUT = PIPELINE_IN>(transformClasses: TransformConstructor<any>[], mergeStrategy: [type: MergeType, mergeFunction?: MergeFunction<PARALLEL_OUT>] | undefined, passedIns: ArrayTwoOrMore<any | undefined>[]): Pipeline<PIPELINE_IN, PIPELINE_OUT>;
    execute(pipelineIn: PIPELINE_IN): Promise<PIPELINE_OUT>;
}
