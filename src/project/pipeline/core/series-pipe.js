import { Log } from '../../log/log.js';
import { BuildError, BuildErrorNumber } from '../../util/index.js';
import { processUnknownError } from '../../util/process-unknown-error-message.js';
export class SeriesPipe {
    _pipeline;
    log;
    _pipe = [];
    constructor(_pipeline, depth) {
        this._pipeline = _pipeline;
        this.log = new Log(depth);
    }
    /**
     * Start a series, which can start anywhere in the pipeline
     * TRANSFORM_CLASS extends Transform = Transform class (constructor)
     * Payload is DIRECTORIES = SERIES_AND_PIPE_IN != PIPELINE_SERIES_AND_PIPE_IN by definition (except if first series, we have to think of general
     * case when pipe creates series in middle of pipeline In general, transform payload out != series out != pipeline payload out
     *
     */
    static start(transformClass, pipeline, payloadOverride) {
        // ----- Multiline Declaration Separator ----- //
        const pipe = new SeriesPipe(pipeline, pipeline.log.depth + 1);
        return pipe.series(transformClass, payloadOverride);
    }
    series(transformClass, payloadOverride) {
        // ----- Multiline Declaration Separator ----- //
        this._pipe.push([new transformClass(this.log.depth + 1), payloadOverride]);
        return this;
    }
    /*
      transform<TRANSFORM_CLASS extends Transform<any, any, any>, PASSED_IN = undefined, PIPE_IN = SERIES_IN, PIPE_OUT = SERIES_IN>(transformClass: TransformConstructor<TRANSFORM_CLASS>,
                                                                                                                                    passedIn?: PASSED_IN): SeriesPipe<SERIES_IN, SERIES_OUT> {
    
        // ----- Declaration separator ----- //
        this._pipes.push(TransformPipe.transform<TRANSFORM_CLASS, PASSED_IN, PIPE_IN, PIPE_OUT>(transformClass, this, passedIn));
        return this;
      };
    
     */
    /**
     * End of the series
     * PIPED_OUT = SERIES PIPED_OUT, which is defined on the class
     *
     */
    endSeries(transformClass, payloadOverride) {
        this._pipe.push([new transformClass(this.log.depth + 1), payloadOverride]);
        return this._pipeline;
    }
    async execute(payload) {
        this.log.info('starting series pipe...', 'pipeline');
        let errorCondition = false;
        try {
            let _payload = payload;
            let output;
            for (let i = 0; i < this._pipe.length; i++) {
                try {
                    const result = this._pipe[i];
                    if (result) {
                        const [transform, payloadOverride] = result;
                        output = await transform.execute(_payload, payloadOverride);
                        _payload = output;
                    }
                    else {
                        throw new BuildError('Unreachable code', undefined, BuildErrorNumber.UnreachableCode);
                    }
                }
                catch (err) {
                    errorCondition = true;
                    return Promise.reject(processUnknownError(err, this.log));
                }
            }
            return Promise.resolve(output);
        }
        catch (err) {
            errorCondition = true;
            return Promise.reject(processUnknownError(err, this.log));
        }
        finally {
            if (errorCondition) {
                this.log.info('...series pipe failed', 'error');
            }
            else {
                this.log.info('...completing series pipe', 'pipeline');
            }
        }
    }
}
