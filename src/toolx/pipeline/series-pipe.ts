import {Action, ActionConstructor} from '../action/action.js';
import {processUnknownError} from '../util/process-unknown-error-message.js';
import {DefaultPayload} from './pipeline-aliases.js';
import {Pipeline} from './pipeline.js';

export class SeriesPipe<PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT> {
  protected _pipe: [action: Action<any, any, any>, payloadOverride: any | undefined][] = [];

  private constructor(protected _pipeline: Pipeline<PIPELINE_IN, PIPELINE_OUT>) {
  }

  /**
   * Start a series, which can start anywhere in the pipeline
   * ACTION_CLASS extends Action = Action class (constructor)
   * Payload is DIRECTORIES = SERIES_IN != PIPELINE_IN by definition (except if first series, we have to think of general case when pipe creates
   * series in middle of pipeline
   * In general, action payload out != series out != pipeline payload out
   *
   */
  static start<
    ACTION_CLASS extends Action<PAYLOAD, ACTION_IN, ACTION_OUT>,
    PAYLOAD = DefaultPayload,
    PIPELINE_IN = undefined,
    PIPELINE_OUT = void,
    SERIES_IN = undefined,
    SERIES_OUT = void,
    ACTION_IN = undefined,
    ACTION_OUT = void>(actionClass: ActionConstructor<ACTION_CLASS, PAYLOAD, ACTION_IN, ACTION_OUT>,
                       pipeline: Pipeline<PIPELINE_IN, PIPELINE_OUT>,
                       payloadOverride?: PAYLOAD): SeriesPipe<PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT> {

    // ----- Multiline Declaration Separator ----- //

    const pipe = new SeriesPipe<PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT>(pipeline);
    return pipe.series<ACTION_CLASS, PAYLOAD, ACTION_IN, ACTION_OUT>(actionClass, payloadOverride);
  }

  series<
    ACTION_CLASS extends Action<PAYLOAD, ACTION_IN, ACTION_OUT>,
    PAYLOAD = DefaultPayload,
    ACTION_IN = undefined,
    ACTION_OUT = void>(actionClass: ActionConstructor<ACTION_CLASS, PAYLOAD, ACTION_IN, ACTION_OUT>,
                       payloadOverride?: PAYLOAD): SeriesPipe<PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT> {
    // ----- Multiline Declaration Separator ----- //

    this._pipe.push([new actionClass(this._pipeline.logDepth + 1), payloadOverride]);
    return this;
  }

  /**
   * End of the series
   * ACTION_OUT = SERIES OUT, which is defined on the class
   *
   */
  endSeries<
    ACTION_CLASS extends Action<PAYLOAD, ACTION_IN, ACTION_OUT>,
    PAYLOAD = DefaultPayload,
    ACTION_IN = undefined,
    ACTION_OUT = void>(actionClass: ActionConstructor<ACTION_CLASS, PAYLOAD, ACTION_IN, ACTION_OUT>,
                       payloadOverride?: PAYLOAD): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    this._pipe.push([new actionClass(this._pipeline.logDepth + 1), payloadOverride]);
    return this._pipeline;
  }

  async execute(payload: SERIES_IN): Promise<SERIES_OUT> {
    let _payload = payload;
    let output: any;
    for (let i = 0; i < this._pipe.length; i++) {
      try {
        const [action, payloadOverride] = this._pipe[i];
        output = await action.execute(_payload, payloadOverride);
        _payload = output;
      } catch (err) {
        return Promise.reject(processUnknownError(err));
      }
    }
    return Promise.resolve(output);
  }
}
