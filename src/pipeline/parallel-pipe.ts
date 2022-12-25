import _ from 'lodash';
import {Action} from '../action/action.js';
import {ActionPipeExecutionResult} from './action-pipe.js';
import {
  ExecutionResult,
  FulfilledStatus,
  isSettledRejected,
  Pipeline,
  RejectedStatus,
  Settled,
  SettledStatus
} from './pipeline.js';

export type ParallelType = 'parallel';
export type ParallelPipeExecutionResults<PAYLOAD_IN, PAYLOAD_OUT, S extends SettledStatus> = ExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, ParallelType, S>;

export type MergeFunction<T> = (parallelPayloads: any[]) => Promise<T>;
export type MergeType = 'asAttributes' | 'asMerged';

export class ParallelPipe<PAYLOAD_IN, PAYLOAD_OUT, PIPELINE_IN, PIPELINE_OUT> {
  protected _pipe: Action<any, any>[] = [];
  protected _mergeStrategy: MergeType | MergeFunction<PAYLOAD_OUT> = 'asAttributes';

  protected constructor(protected _pipeline: Pipeline<PIPELINE_IN, PIPELINE_OUT>) {
  }

  static start<ACTION_OUT, PARALLEL_IN, PARALLEL_OUT, PIPELINE_IN, PIPELINE_OUT>(action: Action<PARALLEL_IN, ACTION_OUT>, pipeline: Pipeline<PIPELINE_IN, PIPELINE_OUT>): ParallelPipe<PARALLEL_IN, PARALLEL_OUT, PIPELINE_IN, PIPELINE_OUT> {
    const pipe = new ParallelPipe<PARALLEL_IN, PARALLEL_OUT, PIPELINE_IN, PIPELINE_OUT>(pipeline);
    return pipe.parallel(action);
  }

  parallel<ACTION_OUT>(action: Action<PAYLOAD_IN, ACTION_OUT>): ParallelPipe<PAYLOAD_IN, PAYLOAD_OUT, PIPELINE_IN, PIPELINE_OUT> {
    this._pipe.push(action);
    return this;
  }

  endParallel<ACTION_OUT>(action?: Action<PAYLOAD_IN, ACTION_OUT>, mergeStrategy: MergeType | MergeFunction<PAYLOAD_OUT> = 'asAttributes'): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    if (action) {
      this._pipe.push(action);
    }
    this._mergeStrategy = mergeStrategy;
    return this._pipeline;
  }

  async execute(payload: PAYLOAD_IN): Promise<ParallelPipeExecutionResults<PAYLOAD_IN, PAYLOAD_OUT, SettledStatus>> {
    const actionResults: ActionPipeExecutionResult<any, any, SettledStatus>[] = [];
    const actionPromises: Promise<any>[] = [];
    let parallelOutput: Partial<PAYLOAD_OUT> = {};
    let parallelActionName = '';
    try {
      for (let i = 0; i < this._pipe.length; i++) {
        const action = this._pipe[i];
        const actionName = action.constructor.name;
        const actionResult: Partial<ActionPipeExecutionResult<any, any, SettledStatus>> = {
          scope: 'action',
          actionName,
          log: 'this',
          input: payload
        };
        parallelActionName = `${i === 0 ? actionName : parallelActionName + '||' + actionName}`;
        actionResults.push(actionResult as ActionPipeExecutionResult<any, any, any>);
        actionPromises.push(action.execute(payload));
      }
      const settlement = await Promise.allSettled(actionPromises);
      let someErrors = false;
      settlement.forEach((settled, ndx) => {
        if (settled.status === 'fulfilled') {
          actionResults[ndx] = {
            ...actionResults[ndx], ...{
              output: settled.value,
              settled: {status: 'fulfilled'} as Settled<FulfilledStatus>
            }
          };
        } else {
          someErrors = true;
          actionResults[ndx] = {
            ...actionResults[ndx], ...{
              output: 'error',
              settled: {status: 'rejected', reason: settled.reason} as Settled<RejectedStatus>
            }
          };
        }
      });
      if(someErrors) {
        const errors: any[] = [];
        actionResults.forEach(result => {
          if(result.settled.status === 'rejected') {
            errors.push((result.settled as Settled<RejectedStatus>).reason);
          }
        })
        return Promise.reject({
          scope: 'parallel',
          actionName: parallelActionName,
          log: actionResults,
          input: payload,
          output: parallelOutput,
          settled: {status: 'rejected', reason: [errors]}
        })
      } else {
        if (this._mergeStrategy === 'asAttributes') {
          let output: PAYLOAD_OUT | Partial<PAYLOAD_OUT> = {};
          actionResults.forEach(result => {
            if (result.actionName !== undefined) {
              output[result.actionName as keyof PAYLOAD_OUT] = result.output;
            }
          });
          console.error(new Error('Unreachable code'));
        } else if (this._mergeStrategy === 'asMerged') {
          const initialValue: any[] = [];
          const outputs = actionResults.reduce((previousValue, currentValue) => {
            previousValue.push(currentValue.output);
            return previousValue;
          }, initialValue);
          parallelOutput = _.merge({}, outputs) as unknown as PAYLOAD_OUT;
        } else if (typeof this._mergeStrategy === 'function') {
          const mergeFunction: MergeFunction<PAYLOAD_OUT> = this._mergeStrategy;
          const initialValue: any[] = [];
          const outputs = actionResults.reduce((previousValue, currentValue) => {
            previousValue.push(currentValue.output);
            return previousValue;
          }, initialValue);
          parallelOutput = await mergeFunction(outputs);
        } else {
          parallelOutput = {'Unreachable Code': 'Unreachable Code'} as unknown as PAYLOAD_OUT;
        }
        return Promise.resolve({
          scope: 'parallel',
          actionName: parallelActionName,
          log: actionResults as ActionPipeExecutionResult<any, any, any>[],
          input: payload,
          output: parallelOutput,
          settled: {status: 'fulfilled'}
        } as ParallelPipeExecutionResults<PAYLOAD_IN, PAYLOAD_OUT, FulfilledStatus>);
      }
    } catch (err) {
      return Promise.reject({
        scope: 'parallel',
        actionName: parallelActionName,
        log: actionResults,
        input: payload,
        output: parallelOutput,
        settled: {status: 'rejected', reason: err}
      });// as ParallelPipeExecutionResults<PAYLOAD_IN, PAYLOAD_OUT, RejectedStatus>);
    }
  }
}
