import _ from 'lodash';
import {Log} from '../log/log.js';
import {Transform, TransformConstructor} from '../transform/index.js';
import {BuildError, BuildErrorNumber} from '../util/index.js';
import {processUnknownError} from '../util/index.js';
import {Pipe} from './pipe.js';
import {Pipeline} from './pipeline.js';

export class SeriesPipe<SERIES_IN, SERIES_OUT = SERIES_IN> implements Pipe<SERIES_IN, SERIES_OUT>{
  log: Log;
  protected _transforms: [transform: Transform<any, any, any>, payloadOverride: any | undefined][] = [];

  private constructor(protected _pipeline: Pipeline<any, any>) {
    this.log = new Log(_pipeline.log.depth + 1);
  }

  copy(pipeline:Pipeline<any, any>): SeriesPipe<SERIES_IN, SERIES_OUT> {
    const seriesPipe = new SeriesPipe<SERIES_IN, SERIES_OUT>(pipeline);

    seriesPipe._transforms = this._transforms.map(([transform, payloadOverride]) => [transform.copy(), _.merge({},payloadOverride)]);
    return seriesPipe;
  }

  /**
   * Start a series, which can start anywhere in the pipeline
   * TRANSFORM_CLASS extends Transform = Transform class (constructor)
   * Payload is DIRECTORIES = SERIES_AND_PIPE_IN != PIPELINE_SERIES_AND_PIPE_IN by definition (except if first series, we have to think of general
   * case when pipe creates series in middle of pipeline In general, transform payload out != series out != pipeline payload out
   *
   */
  static start<
    TRANSFORM_CLASS extends Transform<any, any, any>,
    PASSED_IN,
    SERIES_IN,
    SERIES_OUT = SERIES_IN>(transformClass: TransformConstructor<TRANSFORM_CLASS>,
                pipeline: Pipeline<any, any>,
                payloadOverride?: PASSED_IN): SeriesPipe<SERIES_IN, SERIES_OUT> {

    // ----- Multiline Declaration Separator ----- //

    const pipe = new SeriesPipe<SERIES_IN, SERIES_OUT>(pipeline);
    return pipe.series<TRANSFORM_CLASS, PASSED_IN>(transformClass, payloadOverride);
  }

  series<
    TRANSFORM_CLASS extends Transform<any, any, any>,
    PASSED_IN = undefined>(transformClass: TransformConstructor<TRANSFORM_CLASS>,
               payloadOverride?: PASSED_IN): SeriesPipe<SERIES_IN, SERIES_OUT> {
    // ----- Multiline Declaration Separator ----- //

    this._transforms.push([new transformClass(this.log.depth + 1), payloadOverride]);
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
  endSeries<TRANSFORM_CLASS extends Transform<any, any, any>, PASSED_IN = undefined>(transformClass: TransformConstructor<TRANSFORM_CLASS>,
                                                                                     payloadOverride?: PASSED_IN): Pipeline<any, any> {
    this._transforms.push([new transformClass(this.log.depth + 1), payloadOverride]);
    return this._pipeline;
  }

  async execute(pipeIn: SERIES_IN): Promise<SERIES_OUT> {
    this.log.info('starting series pipe...', 'pipeline');
    let errorCondition = false;
    try {
      let _payload = pipeIn;
      let output: any;
      for (let i = 0; i < this._transforms.length; i++) {
        try {
          const result = this._transforms[i];
          if(result) {
            const [transform, payloadOverride] = result;
            output = await transform.execute(_payload, payloadOverride);
            _payload = output;
          } else {
            throw new BuildError('Unreachable code', undefined, BuildErrorNumber.UnreachableCode);
          }
        } catch (err) {
          errorCondition = true;
          return Promise.reject(processUnknownError(err, this.log));
        }
      }
      return Promise.resolve(output);
    } catch (err) {
      errorCondition = true;
      return Promise.reject(processUnknownError(err, this.log));
    } finally {
      if (errorCondition) {
        this.log.info('...series pipe failed', 'error');
      } else {
        this.log.info('...completing series pipe', 'pipeline');
      }
    }
  }
}
