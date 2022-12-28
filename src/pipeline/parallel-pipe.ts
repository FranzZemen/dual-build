import _ from 'lodash';
import {Action, ActionConstructor} from '../action/action.js';
import {ActionPipeExecutionResult} from './action-pipe.js';
import {FulfilledStatus, ParallelPipeExecutionResults, RejectedStatus, Settled, SettledStatus} from './pipeline-aliases.js';
import {Pipeline} from './pipeline.js';


export type MergeFunction<T> = (parallelPayloads: any[]) => Promise<T>;
export type MergeType = 'asAttributes' | 'asMerged';

export class ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT> {
  protected _pipe: Action<any, any>[] = [];
  protected _mergeStrategy: MergeType | MergeFunction<PARALLEL_OUT> = 'asAttributes';

  protected constructor(protected _pipeline: Pipeline<any, any>) {
  }

  static start<
    ACTION_CLASS extends Action<PARALLEL_IN, ACTION_OUT>,
    PIPELINE_IN,
    PIPELINE_OUT,
    PARALLEL_IN,
    PARALLEL_OUT,
    ACTION_OUT>(actionClass: ActionConstructor<ACTION_CLASS, PARALLEL_IN, ACTION_OUT>, pipeline: Pipeline<any, any>)
    : ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT> {
    // ----- Multiline Declaration Separator ----- //
    const pipe = new ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT>(pipeline);
    return pipe.parallel<ACTION_CLASS, ACTION_OUT>(actionClass);
  }

  parallel<ACTION_CLASS extends Action<PARALLEL_IN, ACTION_OUT>, ACTION_OUT>(
    actionClass: ActionConstructor<ACTION_CLASS, PARALLEL_IN, ACTION_OUT>): ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT> {
    // ----- Multiline Declaration Separator ----- //
    this._pipe.push(new actionClass(this._pipeline.logDepth + 1));
    return this;
  }

  endParallel<ACTION_CLASS extends Action<PARALLEL_IN, ACTION_OUT>, ACTION_OUT>(
    actionClass: ActionConstructor<ACTION_CLASS, PARALLEL_IN, ACTION_OUT>,
    mergeStrategy: MergeType | MergeFunction<PARALLEL_OUT> = 'asAttributes'): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    // ----- Multiline Declaration Separator ----- //
    this._pipe.push(new actionClass(this._pipeline.logDepth + 1));
    this._mergeStrategy = mergeStrategy;
    return this._pipeline;
  }

  async execute(payload: PARALLEL_IN): Promise<ParallelPipeExecutionResults<PARALLEL_IN, PARALLEL_OUT, SettledStatus>> {
    const actionResults: ActionPipeExecutionResult<any, any, SettledStatus>[] = [];
    const actionPromises: Promise<any>[] = [];
    let parallelOutput: Partial<PARALLEL_OUT> = {};
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
              settled: {
                status: 'rejected',
                reason: settled.reason
              } as Settled<RejectedStatus>
            }
          };
        }
      });
      if (someErrors) {
        const errors: any[] = [];
        actionResults.forEach(result => {
          if (result.settled.status === 'rejected') {
            errors.push((result.settled as Settled<RejectedStatus>).reason);
          }
        });
        return Promise.reject({
                                scope: 'parallel',
                                actionName: parallelActionName,
                                log: actionResults,
                                input: payload,
                                output: parallelOutput,
                                settled: {
                                  status: 'rejected',
                                  reason: [errors]
                                }
                              });
      } else {
        if (this._mergeStrategy === 'asAttributes') {
          let output: PARALLEL_OUT | Partial<PARALLEL_OUT> = {};
          actionResults.forEach(result => {
            if (result.actionName !== undefined) {
              output[result.actionName as keyof PARALLEL_OUT] = result.output;
            }
          });
          console.error(new Error('Unreachable code'));
        } else if (this._mergeStrategy === 'asMerged') {
          const initialValue: any[] = [];
          const outputs = actionResults.reduce((previousValue, currentValue) => {
            previousValue.push(currentValue.output);
            return previousValue;
          }, initialValue);
          parallelOutput = _.merge({}, outputs) as unknown as PARALLEL_OUT;
        } else if (typeof this._mergeStrategy === 'function') {
          const mergeFunction: MergeFunction<PARALLEL_OUT> = this._mergeStrategy;
          const initialValue: any[] = [];
          const outputs = actionResults.reduce((previousValue, currentValue) => {
            previousValue.push(currentValue.output);
            return previousValue;
          }, initialValue);
          parallelOutput = await mergeFunction(outputs);
        } else {
          parallelOutput = {'Unreachable Code': 'Unreachable Code'} as unknown as PARALLEL_OUT;
        }
        return Promise.resolve({
                                 scope: 'parallel',
                                 actionName: parallelActionName,
                                 log: actionResults as ActionPipeExecutionResult<any, any, any>[],
                                 input: payload,
                                 output: parallelOutput,
                                 settled: {status: 'fulfilled'}
                               } as ParallelPipeExecutionResults<PARALLEL_IN, PARALLEL_OUT, FulfilledStatus>);
      }
    } catch (err) {
      return Promise.reject({
                              scope: 'parallel',
                              actionName: parallelActionName,
                              log: actionResults,
                              input: payload,
                              output: parallelOutput,
                              settled: {
                                status: 'rejected',
                                reason: err
                              }
                            });// as ParallelPipeExecutionResults<ACTION_IN_AND_OUT, ACTION_OUT, RejectedStatus>);
    }
  }
}
