/*
Created by Franz Zemen 12/15/2022
License Type: 
*/

import _ from 'lodash';
import {inspect} from 'node:util';
import {Action} from '../action/action.js';
/*
export type AnyAction = Action<any, any>;
export type AnySeriesPipe = SeriesPipe<any, any, any, any>;
export type AnyParallelPipe = ParallelPipe<any, any, any, any>;
export type AnyActionPipe = ActionPipe<any, any>;
*/
type FulfilledStatus = 'fulfilled';
type RejectedStatus = 'rejected';
type SettledStatus = FulfilledStatus | RejectedStatus;

type Settled<T extends SettledStatus> = {
  status: T;
} & (T extends FulfilledStatus ? {} : T extends RejectedStatus ? { reason: any } : never);


export type MergeFunction<T> = (parallelPayloads: any[]) => Promise<T>;
type MergeType = 'asAttributes' | 'asMerged';

type ActionType = 'action';
type SeriesType = 'series';
type ParallelType = 'parallel';
type PipeType = ActionType | SeriesType | ParallelType;

type NarrowedPipeType<T extends PipeType> = T extends ActionType ? ActionType : T extends SeriesType ? SeriesType : T extends ParallelType ? ParallelType : never;
type NarrowedLog<PAYLOAD_IN, PAYLOAD_OUT, T extends PipeType, S extends SettledStatus> = T extends ActionType ? 'this' : T extends SeriesType ? ActionPipeExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, S>[] : T extends ParallelType ? ActionPipeExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, S>[] : never;
type ExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, T extends PipeType, S extends SettledStatus> = { scope: NarrowedPipeType<T>, actionName: string, log: NarrowedLog<PAYLOAD_IN, PAYLOAD_OUT, T, S>, input: PAYLOAD_IN, output: PAYLOAD_OUT, settled: Settled<S> };
type ActionPipeExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, S extends SettledStatus> = ExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, ActionType, S>;
type SeriesPipeExecutionResults<PAYLOAD_IN, PAYLOAD_OUT, S extends SettledStatus> = ExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, SeriesType, S>;
type ParallelPipeExecutionResults<PAYLOAD_IN, PAYLOAD_OUT, S extends SettledStatus> = ExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, ParallelType, S>;


class ActionPipe<PAYLOAD_IN, PAYLOAD_OUT> {
  protected constructor(protected _action: Action<PAYLOAD_IN, PAYLOAD_OUT>) {
  }

  static action<ACTION_IN, ACTION_OUT>(action: Action<ACTION_IN, ACTION_OUT>): ActionPipe<ACTION_IN, ACTION_OUT> {
    return new ActionPipe<ACTION_IN, ACTION_OUT>(action);
  }

  get actionName(): string {
    if (this._action) {
      return this._action.constructor.name;
    } else {
      return 'Unreachable code: Containing Object Not Created';
    }
  }

  async execute(payload: PAYLOAD_IN): Promise<ActionPipeExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, SettledStatus>> {
    const actionName = this.actionName;
    try {
      return Promise.resolve({
        scope: 'action',
        actionName,
        input: payload,
        log: 'this',
        output: await this._action.execute(payload),
        settled: {status: 'fulfilled'} as Settled<FulfilledStatus>
      });
    } catch (err) {
      console.error(err);
      return Promise.reject({
        scope: 'action',
        actionName,
        input: payload,
        log: 'this',
        output: 'error',
        settled: {status: 'rejected', reason: err} as Settled<RejectedStatus>
      });
    }
  }
}

class SeriesPipe<PAYLOAD_IN, PAYLOAD_OUT, PIPELINE_IN, PIPELINE_OUT> {
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
        } catch (actionError) {
          actionResults.push({
            scope: 'action',
            actionName,
            log: 'this',
            input,
            output: {error: 'error'} ,
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
          output: {error: 'error'} ,
          settled: {status: 'rejected', reason: actionError}
        } as SeriesPipeExecutionResults<PAYLOAD_IN, PAYLOAD_OUT, RejectedStatus>);
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
      console.error(err);
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

class ParallelPipe<PAYLOAD_IN, PAYLOAD_OUT, PIPELINE_IN, PIPELINE_OUT> {
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
      settlement.forEach((settled, ndx) => {
        if (settled.status === 'fulfilled') {
          actionResults[ndx] = {
            ...actionResults[ndx], ...{
              output: settled.value,
              settled: {status: 'fulfilled'} as Settled<FulfilledStatus>
            }
          };
        } else {
          actionResults[ndx] = {
            ...actionResults[ndx], ...{
              output: 'error',
              settled: {status: 'rejected', reason: settled.reason} as Settled<RejectedStatus>
            }
          };
        }
      });
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
    } catch (err) {
      console.error(err);
      return Promise.reject({
        scope: 'parallel',
        actionName: parallelActionName,
        log: actionResults,
        input: payload,
        output: parallelOutput
      } as ParallelPipeExecutionResults<PAYLOAD_IN, PAYLOAD_OUT, RejectedStatus>);
    }
  }
}


type Pipe = Action<any, any> | SeriesPipe<any, any, any, any> | ParallelPipe<any, any, any, any>;

export class Pipeline<PIPELINE_IN, PIPELINE_OUT> {
  protected _pipes: Pipe[] = [];

  private constructor() {

  }

  static action<ACTION_OUT, PIPELINE_IN, PIPELINE_OUT>(action: Action<PIPELINE_IN, ACTION_OUT>): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    const pipeline = new Pipeline<PIPELINE_IN, PIPELINE_OUT>;
    pipeline._pipes.push(ActionPipe.action<PIPELINE_IN, ACTION_OUT>(action));
    return pipeline;
  };

  static startSeries<ACTION_OUT, SERIES_OUT, PIPELINE_IN, PIPELINE_OUT>(action: Action<PIPELINE_IN, ACTION_OUT>): SeriesPipe<PIPELINE_IN, SERIES_OUT, PIPELINE_IN, PIPELINE_OUT> {
    const pipeline = new Pipeline<PIPELINE_IN, PIPELINE_OUT>;
    const seriesPipe = SeriesPipe.start<ACTION_OUT, PIPELINE_IN, SERIES_OUT, PIPELINE_IN, PIPELINE_OUT>(action, pipeline);
    pipeline._pipes.push(seriesPipe);
    return seriesPipe;
  };

  static startParallel<ACTION_OUT, PARALLEL_OUT, PIPELINE_IN, PIPELINE_OUT>(action: Action<PIPELINE_IN, ACTION_OUT>): ParallelPipe<PIPELINE_IN, PARALLEL_OUT, PIPELINE_IN, PIPELINE_OUT> {
    const pipeline = new Pipeline<PIPELINE_IN, PIPELINE_OUT>;
    const parallelPipe = ParallelPipe.start<ACTION_OUT, PIPELINE_IN, PARALLEL_OUT, PIPELINE_IN, PIPELINE_OUT>(action, pipeline);
    pipeline._pipes.push(parallelPipe);
    return parallelPipe;
  };

  action<ACTION_IN, ACTION_OUT>(action: Action<ACTION_IN, ACTION_OUT>): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    this._pipes.push(ActionPipe.action<ACTION_IN, ACTION_OUT>(action));
    return this;
  };

  startSeries<ACTION_OUT, SERIES_IN, SERIES_OUT>(action: Action<SERIES_IN, ACTION_OUT>): SeriesPipe<SERIES_IN, SERIES_OUT, PIPELINE_IN, PIPELINE_OUT> {
    const seriesPipe = SeriesPipe.start<ACTION_OUT, SERIES_IN, SERIES_OUT, PIPELINE_IN, PIPELINE_OUT>(action, this);
    this._pipes.push(seriesPipe);
    return seriesPipe;
  };

  startParallel<ACTION_OUT, PARALELL_IN, PAYLOAD_OUT>(action: Action<PARALELL_IN, ACTION_OUT>): ParallelPipe<PARALELL_IN, PAYLOAD_OUT, PIPELINE_IN, PIPELINE_OUT> {
    const parallelPipe = ParallelPipe.start<ACTION_OUT, PARALELL_IN, PAYLOAD_OUT, PIPELINE_IN, PIPELINE_OUT>(action, this);
    this._pipes.push(parallelPipe);
    return parallelPipe;
  };

  async execute(payload: PIPELINE_IN): Promise<PIPELINE_OUT> {
    let inputPayload = payload;
    let outputPayload = undefined;
    const results: ExecutionResult<any, any, any, any> [] = [];
    try {
      for (let i = 0; i < this._pipes.length; i++) {
        const pipe: Pipe = this._pipes[i];
        let result: ExecutionResult<any, any, any, any>;
        result = await pipe.execute(payload);
        results.push(result);
        inputPayload = result.output;
        outputPayload = result.output;
      }
      console.log(inspect(results, false, 10, true));
      return Promise.resolve(outputPayload as PIPELINE_OUT);
    } catch (err) {
      console.log(inspect(results, false, 10, true));
      return Promise.reject(err);
    }
  }
}

