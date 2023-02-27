import { Log } from '../../log/log.js';
import { Transform, TransformConstructor } from '../../transform/transform.js';
import { Pipeline } from './pipeline.js';
export declare class SeriesPipe<SERIES_IN, SERIES_OUT = SERIES_IN> {
    protected _pipeline: Pipeline<any, any>;
    log: Log;
    protected _pipe: [transform: Transform<any, any, any>, payloadOverride: any | undefined][];
    private constructor();
    /**
     * Start a series, which can start anywhere in the pipeline
     * TRANSFORM_CLASS extends Transform = Transform class (constructor)
     * Payload is DIRECTORIES = SERIES_AND_PIPE_IN != PIPELINE_SERIES_AND_PIPE_IN by definition (except if first series, we have to think of general
     * case when pipe creates series in middle of pipeline In general, transform payload out != series out != pipeline payload out
     *
     */
    static start<TRANSFORM_CLASS extends Transform<any, any, any>, PASSED_IN, SERIES_IN, SERIES_OUT = SERIES_IN>(transformClass: TransformConstructor<TRANSFORM_CLASS>, pipeline: Pipeline<any, any>, payloadOverride?: PASSED_IN): SeriesPipe<SERIES_IN, SERIES_OUT>;
    series<TRANSFORM_CLASS extends Transform<any, any, any>, PASSED_IN = undefined>(transformClass: TransformConstructor<TRANSFORM_CLASS>, payloadOverride?: PASSED_IN): SeriesPipe<SERIES_IN, SERIES_OUT>;
    /**
     * End of the series
     * PIPED_OUT = SERIES PIPED_OUT, which is defined on the class
     *
     */
    endSeries<TRANSFORM_CLASS extends Transform<any, any, any>, PASSED_IN = undefined>(transformClass: TransformConstructor<TRANSFORM_CLASS>, payloadOverride?: PASSED_IN): Pipeline<any, any>;
    execute(payload: SERIES_IN): Promise<SERIES_OUT>;
}
