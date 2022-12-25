import {Action} from '../action/action.js';
import {processUnknownError} from '../util/process-unknown-error-message.js';
import {ActionPipeExecutionResult} from './action-pipe.js';
import {ExecutionResult, FulfilledStatus, Pipeline, RejectedStatus, Settled, SettledStatus} from './pipeline.js';

export type SeriesType = 'series';
export type SeriesPipeExecutionResults<PAYLOAD_IN, PAYLOAD_OUT, S extends SettledStatus> = ExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, SeriesType, S>;



export class SeriesPipe<PAYLOAD_IN, PAYLOAD_OUT, PIPELINE_IN, PIPELINE_OUT> {
  protected _pipe: Action<any, any>[] = [];

  protected constructor(protected _pipeline: Pipeline<PIPELINE_IN, PIPELINE_OUT>) {
  }

  static start<ACTION_OUT, SERIES_IN, SERIES_OUT, PIPELINE_IN, PIPELINE_OUT>(action: Action<SERIES_IN, ACTION_OUT>, pipeline: Pipeline<PIPELINE_IN, PIPELINE_OUT>): SeriesPipe<SERIES_IN, SERIES_OUT, PIPELINE_IN, PIPELINE_OUT> {
    const pipe = new SeriesPipe<SERIES_IN, SERIES_OUT, PIPELINE_IN, PIPELINE_OUT>(pipeline);
    return pipe.series(action);
  }

  series<ACTION_IN, ACTION_OUT>(action: Action<ACTION_IN, ACTION_OUT>): SeriesPipe<PAYLOAD_IN, PAYLOAD_OUT, PIPELINE_IN, PIPELINE_OUT> {
    this._pipe.push(action);
    return this;
  }

  endSeries<ACTION_IN>(action?: Action<ACTION_IN, PAYLOAD_OUT>): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    if (action) {
      this._pipe.push(action);
    }
    return this._pipeline;
  }

  async execute(payload: PAYLOAD_IN): Promise<SeriesPipeExecutionResults<PAYLOAD_IN, PAYLOAD_OUT, SettledStatus>> {
    let seriesActionName: string = '';
    const actionResults: ActionPipeExecutionResult<any, any, SettledStatus>[] = [];
    let seriesOutput: PAYLOAD_OUT = {} as PAYLOAD_OUT;
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
          seriesOutput = output;
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
        }); //as SeriesPipeExecutionResults<PAYLOAD_IN, PAYLOAD_OUT, RejectedStatus>);
      } else {
        return Promise.resolve({
          scope: 'series',
          actionName: seriesActionName,
          log: actionResults,
          input: payload,
          output: seriesOutput,
          settled: {status: 'fulfilled'}
        } as SeriesPipeExecutionResults<PAYLOAD_IN, PAYLOAD_OUT, FulfilledStatus>);
      }
    } catch (err) {
      return Promise.reject({
        scope: 'series',
        actionName: seriesActionName,
        log: actionResults,
        input: payload,
        output: seriesOutput,
        settled: {status: 'rejected', reason: err}
      } as SeriesPipeExecutionResults<PAYLOAD_IN, PAYLOAD_OUT, RejectedStatus>);
    }
  }
}
