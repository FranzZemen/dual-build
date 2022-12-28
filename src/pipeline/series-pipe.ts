import {Action, ActionConstructor} from '../action/action.js';
import {processUnknownError} from '../util/process-unknown-error-message.js';
import {ActionPipeExecutionResult} from './action-pipe.js';
import {
  DefaultPayload,
  FulfilledStatus,
  RejectedStatus,
  SeriesPipeExecutionResults,
  Settled,
  SettledStatus,
  TransformFunction
} from './pipeline-aliases.js';
import {Pipeline} from './pipeline.js';

export class SeriesPipe<PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT> {
  protected _pipe: (Action<any, any> | TransformFunction<any, any>)[] = [];

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

  transform<TRANSFORM_IN, TRANSFORM_OUT>(transform: TransformFunction<TRANSFORM_IN, TRANSFORM_OUT>): SeriesPipe<PIPELINE_IN,PIPELINE_OUT,SERIES_IN, SERIES_OUT>{
    this._pipes.push(transform);
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

  async execute(payload: SERIES_IN): Promise<SeriesPipeExecutionResults<SERIES_IN, SERIES_OUT, SettledStatus>> {
    let seriesActionName: string = '';
    const actionResults: ActionPipeExecutionResult<any, any, SettledStatus>[] = [];
    let partialSeriesOutput: Partial<SERIES_OUT> = {};
    try {
      let input = payload;
      let actionName: string = '';
      let actionError: Error | undefined;
      for (let i = 0; i < this._pipe.length; i++) {
        const actionOrTransformFunction = this._pipe[i];
        if(! (actionOrTransformFunction instanceof Action)) {
          const transform: TransformFunction<any, any> = actionOrTransformFunction;
          continue;
        }
        actionName = '';
        const action = this._pipe[i];
        actionName = action.constructor.name;
        seriesActionName = `${i === 0 ? actionName : seriesActionName + '&&' + actionName}`;
        try {
          const output = await action.execute(input);
          actionResults.push({
                               scope: 'action',
                               actionName,
                               log: 'this',
                               input,
                               output,
                               settled: {status: 'fulfilled'} as Settled<FulfilledStatus>
                             });
          partialSeriesOutput = output;
          input = output;
        } catch (err) {
          actionError = processUnknownError(err);
          actionResults.push({
                               scope: 'action',
                               actionName,
                               log: 'this',
                               input,
                               output: {error: 'error'},
                               settled: {
                                 status: 'rejected',
                                 reason: actionError
                               } as Settled<RejectedStatus>
                             });
          break;
        }
      }
      if (actionError) {
        return Promise.reject({
                                scope: 'series',
                                actionName: seriesActionName,
                                log: actionResults,
                                input: payload,
                                output: {error: 'error'},
                                settled: {
                                  status: 'rejected',
                                  reason: actionError
                                }
                              });
      } else {
        return Promise.resolve({
                                 scope: 'series',
                                 actionName: seriesActionName,
                                 log: actionResults,
                                 input: payload,
                                 output: partialSeriesOutput as SERIES_OUT,
                                 settled: {status: 'fulfilled'}
                               } as SeriesPipeExecutionResults<SERIES_IN, SERIES_OUT, FulfilledStatus>);
      }
    } catch (err) {
      return Promise.reject({
                              scope: 'series',
                              actionName: seriesActionName,
                              log: actionResults,
                              input: payload,
                              output: partialSeriesOutput,
                              settled: {
                                status: 'rejected',
                                reason: err
                              }
                            } as SeriesPipeExecutionResults<SERIES_IN, SERIES_OUT, RejectedStatus>);
    }
  }
}
