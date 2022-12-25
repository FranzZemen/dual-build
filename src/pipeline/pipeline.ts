/*
Created by Franz Zemen 12/15/2022
License Type: 
*/

import {performance} from 'node:perf_hooks';
import {inspect} from 'node:util';
import {Action} from '../action/action.js';
import {NestedLog} from '../log/nested-log.js';
import {processUnknownError, processUnknownErrorMessage} from '../util/process-unknown-error-message.js';
import {clearTiming, endTiming, isTimingNotFound, startTiming} from '../util/timing.js';
import {ActionPipe, ActionPipeExecutionResult, ActionType} from './action-pipe.js';
import {ParallelPipe, ParallelType} from './parallel-pipe.js';
import {SeriesPipe, SeriesType} from './series-pipe.js';

export type FulfilledStatus = 'fulfilled';
export type RejectedStatus = 'rejected';
export type SettledStatus = FulfilledStatus | RejectedStatus;

export type Settled<T extends SettledStatus> = {
  status: T;
} & (T extends FulfilledStatus ? {} : T extends RejectedStatus ? { reason: any } : never);


export type PipeType = ActionType | SeriesType | ParallelType;

export type NarrowedPipeType<T extends PipeType> = T extends ActionType ? ActionType : T extends SeriesType ? SeriesType : T extends ParallelType ? ParallelType : never;
export type NarrowedLog<PAYLOAD_IN, PAYLOAD_OUT, T extends PipeType, S extends SettledStatus> = T extends ActionType ? 'this' : T extends SeriesType ? ActionPipeExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, S>[] : T extends ParallelType ? ActionPipeExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, S>[] : never;
export type ExecutionResult<PAYLOAD_IN, PAYLOAD_OUT, T extends PipeType, S extends SettledStatus> = { scope: NarrowedPipeType<T>, actionName: string, log: NarrowedLog<PAYLOAD_IN, PAYLOAD_OUT, T, S>, input: PAYLOAD_IN, output: PAYLOAD_OUT, settled: Settled<S> };

export function isExecutionResult(result: any | ExecutionResult<any, any, any, any>): result is ExecutionResult<any, any, any, any> {
  return 'scope' in result;
}

export function isSettledRejected(settled: Settled<'fulfilled'> | Settled<'rejected'>): settled is Settled<'rejected'> {
  return settled.status === 'rejected';
}

type Pipe = ActionPipe<any, any> | SeriesPipe<any, any, any, any> | ParallelPipe<any, any, any, any>;

export class Pipeline<PIPELINE_IN, PIPELINE_OUT> {
  protected _pipes: Pipe[] = [];
  protected static index = 1;
  log: NestedLog;

  private constructor(protected name?: string, protected logDepth: number = 0) {
    if (!this.name) {
      this.name = Pipeline.name + Pipeline.index++;
    }
    this.log = new NestedLog(logDepth);
  }

  static action<ACTION_OUT, PIPELINE_IN, PIPELINE_OUT>(action: Action<PIPELINE_IN, ACTION_OUT>, pipelineName?: string, logDepth = 0): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    const pipeline = new Pipeline<PIPELINE_IN, PIPELINE_OUT>(pipelineName, logDepth);
    action.logDepth = logDepth + 1;
    pipeline._pipes.push(ActionPipe.action<PIPELINE_IN, ACTION_OUT>(action));
    return pipeline;
  };

  static startSeries<ACTION_OUT, SERIES_OUT, PIPELINE_IN, PIPELINE_OUT>(action: Action<PIPELINE_IN, ACTION_OUT>, pipelineName?: string, logDepth = 0): SeriesPipe<PIPELINE_IN, SERIES_OUT, PIPELINE_IN, PIPELINE_OUT> {
    const pipeline = new Pipeline<PIPELINE_IN, PIPELINE_OUT>(pipelineName, logDepth);
    action.logDepth = logDepth + 1;
    const seriesPipe = SeriesPipe.start<ACTION_OUT, PIPELINE_IN, SERIES_OUT, PIPELINE_IN, PIPELINE_OUT>(action, pipeline);
    pipeline._pipes.push(seriesPipe);
    return seriesPipe;
  };

  static startParallel<ACTION_OUT, PARALLEL_OUT, PIPELINE_IN, PIPELINE_OUT>(action: Action<PIPELINE_IN, ACTION_OUT>, pipelineName?: string, logDepth = 0): ParallelPipe<PIPELINE_IN, PARALLEL_OUT, PIPELINE_IN, PIPELINE_OUT> {
    const pipeline = new Pipeline<PIPELINE_IN, PIPELINE_OUT>(pipelineName, logDepth);
    action.logDepth = logDepth + 1;
    const parallelPipe = ParallelPipe.start<ACTION_OUT, PIPELINE_IN, PARALLEL_OUT, PIPELINE_IN, PIPELINE_OUT>(action, pipeline);
    pipeline._pipes.push(parallelPipe);
    return parallelPipe;
  };

  action<ACTION_IN, ACTION_OUT>(action: Action<ACTION_IN, ACTION_OUT>): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    action.logDepth = this.logDepth + 1;
    this._pipes.push(ActionPipe.action<ACTION_IN, ACTION_OUT>(action));
    return this;
  };

  startSeries<ACTION_OUT, SERIES_IN, SERIES_OUT>(action: Action<SERIES_IN, ACTION_OUT>): SeriesPipe<SERIES_IN, SERIES_OUT, PIPELINE_IN, PIPELINE_OUT> {
    action.logDepth = this.logDepth + 1;
    const seriesPipe = SeriesPipe.start<ACTION_OUT, SERIES_IN, SERIES_OUT, PIPELINE_IN, PIPELINE_OUT>(action, this);
    this._pipes.push(seriesPipe);
    return seriesPipe;
  };

  startParallel<ACTION_OUT, PARALELL_IN, PAYLOAD_OUT>(action: Action<PARALELL_IN, ACTION_OUT>): ParallelPipe<PARALELL_IN, PAYLOAD_OUT, PIPELINE_IN, PIPELINE_OUT> {
    action.logDepth = this.logDepth + 1;
    const parallelPipe = ParallelPipe.start<ACTION_OUT, PARALELL_IN, PAYLOAD_OUT, PIPELINE_IN, PIPELINE_OUT>(action, this);
    this._pipes.push(parallelPipe);
    return parallelPipe;
  };

  async execute(payload: PIPELINE_IN): Promise<PIPELINE_OUT> {
    this.log.info(`starting pipeline ${this.name}...`);

    const timingMark = `Timing ${Pipeline.name}:${this.name}.execute`;
    const startTimingSuccessful = startTiming(timingMark, this.log);

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

      this.log.info(`...pipeline ${this.name} completed ${startTimingSuccessful ? endTiming(timingMark, this.log) : ''}`);

      return outputPayload;
    } catch (err) {
      this.log.info(`...pipeline ${this.name} failed`, 'error');
      if(isExecutionResult(err)) {
        if(isSettledRejected(err.settled)) {
          if(Array.isArray(err.settled.reason)) {
            err.settled.reason.forEach(reason => {
              this.log.error(reason);
            });
          } else {
            this.log.error(err.settled.reason);
          }
          throw new Error ('handled');
        } else {
          throw new Error ('Unreachable code');
        }
      } else {
        const error = processUnknownError(err);
        this.log.error(error);
        throw error;
      }
      //this.log.error(processUnknownError(err));
      //this.log.info({error: processUnknownErrorMessage(err), results: inspect(results, false, 10, true)}, 'error');

      //return Promise.reject(new Error(e));
    } finally {
      clearTiming(timingMark);
    }
  }
}

