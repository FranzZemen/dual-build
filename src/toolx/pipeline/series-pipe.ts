import {Transform, TransformConstructor} from '../transform/transform.js';
import {Log} from '../log/log.js';
import {processUnknownError} from '../util/process-unknown-error-message.js';
import {DefaultPayload} from './pipeline-aliases.js';
import {Pipeline} from './pipeline.js';

export class SeriesPipe<PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT> {
  protected _pipe: [transform: Transform<any, any, any>, payloadOverride: any | undefined][] = [];
  log: Log;

  private constructor(protected _pipeline: Pipeline<PIPELINE_IN, PIPELINE_OUT>, depth: number) {
    this.log = new Log(depth);
  }

  /**
   * Start a series, which can start anywhere in the pipeline
   * TRANSFORM_CLASS extends Transform = Transform class (constructor)
   * Payload is DIRECTORIES = SERIES_IN != PIPELINE_IN by definition (except if first series, we have to think of general case when pipe creates
   * series in middle of pipeline
   * In general, transform payload out != series out != pipeline payload out
   *
   */
  static start<
    TRANSFORM_CLASS extends Transform<PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
    PAYLOAD = DefaultPayload,
    PIPELINE_IN = undefined,
    PIPELINE_OUT = void,
    SERIES_IN = undefined,
    SERIES_OUT = void,
    TRANSFORM_IN = undefined,
    TRANSFORM_OUT = void>(transformClass: TransformConstructor<TRANSFORM_CLASS, PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
                       pipeline: Pipeline<PIPELINE_IN, PIPELINE_OUT>,
                       payloadOverride?: PAYLOAD): SeriesPipe<PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT> {

    // ----- Multiline Declaration Separator ----- //

    const pipe = new SeriesPipe<PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT>(pipeline, pipeline.log.depth +1);
    return pipe.series<TRANSFORM_CLASS, PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>(transformClass, payloadOverride);
  }

  series<
    TRANSFORM_CLASS extends Transform<PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
    PAYLOAD = DefaultPayload,
    TRANSFORM_IN = undefined,
    TRANSFORM_OUT = void>(transformClass: TransformConstructor<TRANSFORM_CLASS, PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
                       payloadOverride?: PAYLOAD): SeriesPipe<PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT> {
    // ----- Multiline Declaration Separator ----- //

    this._pipe.push([new transformClass(this._pipeline.log.depth + 1), payloadOverride]);
    return this;
  }

  /**
   * End of the series
   * TRANSFORM_OUT = SERIES OUT, which is defined on the class
   *
   */
  endSeries<
    TRANSFORM_CLASS extends Transform<PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
    PAYLOAD = DefaultPayload,
    TRANSFORM_IN = undefined,
    TRANSFORM_OUT = void>(transformClass: TransformConstructor<TRANSFORM_CLASS, PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
                       payloadOverride?: PAYLOAD): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    this._pipe.push([new transformClass(this._pipeline.log.depth + 1), payloadOverride]);
    return this._pipeline;
  }

  async execute(payload: SERIES_IN): Promise<SERIES_OUT> {
    this.log.info('starting series pipe...', 'pipeline');
    let errorCondition = false;
    try {
      let _payload = payload;
      let output: any;
      for (let i = 0; i < this._pipe.length; i++) {
        try {
          const [transform, payloadOverride] = this._pipe[i];
          output = await transform.execute(_payload, payloadOverride);
          _payload = output;
        } catch (err) {
          errorCondition = true;
          return Promise.reject(processUnknownError(err));
        }
      }
      return Promise.resolve(output);
    } catch (err) {
      errorCondition = true;
      return Promise.reject(processUnknownError(err));
    } finally {
      if (errorCondition) {
        this.log.info('...series pipe failed', 'error');
      } else {
        this.log.info('...completing series pipe', 'pipeline');
      }
    }
  }
}
