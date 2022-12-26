import {Action, ActionConstructor} from '../action/action.js';
import {BootstrapOptions} from '../options/index.js';
import {processUnknownError} from '../util/process-unknown-error-message.js';
import {ActionPipeExecutionResult} from './action-pipe.js';
import {ExecutionResult, FulfilledStatus, Pipeline, RejectedStatus, Settled, SettledStatus} from './pipeline.js';

export type SeriesType = 'series';
export type SeriesPipeExecutionResults<PAYLOAD_IN, PAYLOAD_OUT, S extends SettledStatus> = ExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, SeriesType, S>;



export class SeriesPipe<SERIES_IN, SERIES_OUT> {
  protected _pipe: Action<any, any>[] = [];

  protected constructor(protected _pipeline: Pipeline<any, any>) {
  }

  /**
   * Start a series, which can start anywhere in the pipeline
   * ACTION_CLASS extends Action = Action class (constructor)
   * Payload is ACTION_IN = SERIES_IN != PIPELINE_IN by definition (except if first series, we have to think of general case when pipe creates
   * series in middle of pipeline
   * In general, action payload out != series out != pipeline payload out
   *
   */
  static start<ACTION_CLASS extends Action<ACTION_IN, ACTION_OUT>, ACTION_IN, ACTION_OUT,SERIES_OUT>
  (actionClass: ActionConstructor<ACTION_CLASS, ACTION_IN, ACTION_OUT>, pipeline: Pipeline<any, any>)
    : SeriesPipe<ACTION_IN, SERIES_OUT> {
    // ----- Declaration separator ----- //
    const pipe = new SeriesPipe<ACTION_IN, SERIES_OUT>(pipeline);
    return pipe.series<ACTION_CLASS, ACTION_IN, ACTION_OUT>(actionClass);
  }

  series<ACTION_CLASS extends Action<ACTION_IN, ACTION_OUT>, ACTION_IN, ACTION_OUT>
  (actionClass: ActionConstructor<ACTION_CLASS, ACTION_IN, ACTION_OUT>): SeriesPipe<SERIES_IN, SERIES_OUT> {
    // ----- Declaration separator ----- //
    this._pipe.push(new actionClass(this._pipeline.logDepth + 1));
    return this;
  }

  /**
   * End of the series
   * ACTION_OUT = SERIES OUT, which is defined on the class
   *
   */
  endSeries<ACTION_CLASS extends Action<ACTION_IN, SERIES_OUT>, ACTION_IN>
  (actionClass: ActionConstructor<ACTION_CLASS, ACTION_IN, SERIES_OUT>): Pipeline<any, any> {
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
            settled: {status: 'rejected', reason: actionError} as Settled<RejectedStatus>
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
          settled: {status: 'rejected', reason: actionError}
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
        settled: {status: 'rejected', reason: err}
      } as SeriesPipeExecutionResults<SERIES_IN, SERIES_OUT, RejectedStatus>);
    }
  }
}
