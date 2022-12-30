import {Action, ActionConstructor} from '../action/action.js';
import {processUnknownError} from '../util/process-unknown-error-message.js';
import {Pipeline} from './pipeline.js';

export class SeriesPipe<PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT> {
  protected _pipe: Action<any, any>[] = [];

  private constructor(protected _pipeline: Pipeline<PIPELINE_IN, PIPELINE_OUT>) {
  }
  /**
   * Start a series, which can start anywhere in the pipeline
   * ACTION_CLASS extends Action = Action class (constructor)
   * Payload is ACTION_IN_AND_OUT = SERIES_IN != PIPELINE_IN by definition (except if first series, we have to think of general case when pipe creates
   * series in middle of pipeline
   * In general, action payload out != series out != pipeline payload out
   *
   */
  static start<
    ACTION_CLASS extends Action<SERIES_IN, ACTION_OUT>,
    PIPELINE_IN,
    PIPELINE_OUT,
    SERIES_IN,
    SERIES_OUT,
    ACTION_OUT>(actionClass: ActionConstructor<ACTION_CLASS, SERIES_IN, ACTION_OUT>, pipeline: Pipeline<PIPELINE_IN, PIPELINE_OUT>)
    : SeriesPipe<PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT> {
    // ----- Multiline Declaration Separator ----- //

    const pipe = new SeriesPipe<PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT>(pipeline);
    return pipe.series<ACTION_CLASS, SERIES_IN, ACTION_OUT>(actionClass);
  }

  series<
    ACTION_CLASS extends Action<ACTION_IN, ACTION_OUT>,
    ACTION_IN,
    ACTION_OUT>(actionClass: ActionConstructor<ACTION_CLASS, ACTION_IN, ACTION_OUT>)
    : SeriesPipe<PIPELINE_IN,PIPELINE_OUT,SERIES_IN, SERIES_OUT> {
    // ----- Multiline Declaration Separator ----- //
    this._pipe.push(new actionClass(this._pipeline.logDepth + 1));
    return this;
  }

  /**
   * End of the series
   * ACTION_OUT = SERIES OUT, which is defined on the class
   *
   */
  endSeries<
    ACTION_CLASS extends Action<ACTION_IN, SERIES_OUT>,
    ACTION_IN>(actionClass: ActionConstructor<ACTION_CLASS, ACTION_IN, SERIES_OUT>): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    this._pipe.push(new actionClass(this._pipeline.logDepth + 1));
    return this._pipeline;
  }

  async execute(payload: SERIES_IN): Promise<SERIES_OUT> {
      let input = payload;
      let output: any;
      for (let i = 0; i < this._pipe.length; i++) {
        const action = this._pipe[i];
        try {
          output = await action.execute(input);
          input = output;
        } catch (err) {
          return Promise.reject(processUnknownError(err));
        }
      }
      return Promise.resolve(output);
  }
}
