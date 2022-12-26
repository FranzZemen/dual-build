/*
Created by Franz Zemen 12/15/2022
License Type: 
*/

import {v4 as uuidV4} from 'uuid';
import {Action, ActionConstructor} from '../action/action.js';
import {NestedLog} from '../log/nested-log.js';
import {processUnknownError} from '../util/process-unknown-error-message.js';
import {clearTiming, endTiming, startTiming} from '../util/timing.js';
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

export type Pipe = ActionPipe<any, any> | SeriesPipe<any, any> | ParallelPipe<any, any>;

export type PipelineOptions = {
  name: string;
  logDepth: number;
}

export function defaultPipelineOptions(): PipelineOptions {
  return {
    name: `Pipeline-${uuidV4()}`,
    logDepth: 0
  };
}



/**
 * PIPELINE_IN = The payload starting the pipeline
 * PIPELINE_OUT = The payload coming out of the pipeline
 */
export class Pipeline<PIPELINE_IN, PIPELINE_OUT> {
  protected _pipes: Pipe[] = [];
  protected static index = 1;
  log: NestedLog;
  name: string;
  logDepth: number;

  private constructor(options: PipelineOptions) {
    this.name = options.name;
    this.logDepth = options.logDepth;
    this.log = new NestedLog(options.logDepth);
  }

  /**
   * If this is not called, the defaultOptions function will be use.
   *
   * @param options
   */
  static options<PIPELINE_IN, PIPELINE_OUT>(options: PipelineOptions) {
    return new Pipeline<PIPELINE_IN, PIPELINE_OUT>(options);
  }

  /**
   * Start the pipeline with an action
   * ACTION_CLASS extends Action = Action class (constructor)
   * Payload is ACTION_IN = PIPELINE_IN by definition since it is the start of the pipeline
   * In general, action payload out != pipeline payload out
   *
   */
  static action<ACTION_CLASS extends Action<PAYLOAD_IN, PAYLOAD_OUT>,  PAYLOAD_IN, PAYLOAD_OUT, PIPELINE_OUT>
  (actionClass: ActionConstructor<ACTION_CLASS, PAYLOAD_IN, PAYLOAD_OUT>): Pipeline<PAYLOAD_IN, PIPELINE_OUT> {
    // ----- Declaration separator ----- //
    const options = defaultPipelineOptions();
    const pipeline = new Pipeline<PAYLOAD_IN, PIPELINE_OUT>(options);
    pipeline._pipes.push(ActionPipe.action<ACTION_CLASS, PAYLOAD_IN, PAYLOAD_OUT>(actionClass, pipeline));
    return pipeline;
  };

  /**
   * Start the pipeline with a series
   * ACTION_CLASS extends Action = Action class (constructor)
   * Payload is ACTION_IN = SERIES_IN = PIPELINE_IN by definition since it is the start of the pipeline
   * In general, action payload out != series out != pipeline payload out
   *
   */
  static startSeries<ACTION_CLASS extends Action<ACTION_IN, ACTION_OUT>, ACTION_IN, ACTION_OUT, SERIES_OUT, PIPELINE_OUT>
  (actionClass: ActionConstructor<ACTION_CLASS, ACTION_IN, ACTION_OUT>): SeriesPipe<ACTION_IN, SERIES_OUT> {
    // ----- Declaration separator ----- //
    const options = defaultPipelineOptions();
    const pipeline = new Pipeline<ACTION_IN, PIPELINE_OUT>(options);
    const seriesPipe = SeriesPipe.start<ACTION_CLASS, ACTION_IN, ACTION_OUT, SERIES_OUT>(actionClass, pipeline);
    pipeline._pipes.push(seriesPipe);
    return seriesPipe;
  };

  static startParallel<ACTION_CLASS extends Action<ACTION_IN, ACTION_OUT>, ACTION_IN, ACTION_OUT, PARALLEL_OUT, PIPELINE_OUT>
  (actionClass: ActionConstructor<ACTION_CLASS, ACTION_IN, ACTION_OUT>): ParallelPipe<ACTION_IN, PARALLEL_OUT> {
    // ----- Declaration separator ----- //
    const options = defaultPipelineOptions();
    const pipeline = new Pipeline<ACTION_IN, PIPELINE_OUT>(options);
    const parallelPipe = ParallelPipe.start<ACTION_CLASS, ACTION_IN, ACTION_OUT, PARALLEL_OUT>(actionClass, pipeline);
    pipeline._pipes.push(parallelPipe);
    return parallelPipe;
  };

  action<ACTION_CLASS extends Action<ACTION_IN, ACTION_OUT>, ACTION_IN, ACTION_OUT>
  (actionClass: ActionConstructor<ACTION_CLASS, ACTION_IN, ACTION_OUT>): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    // ----- Declaration separator ----- //
    this._pipes.push(ActionPipe.action<ACTION_CLASS,ACTION_IN, ACTION_OUT>(actionClass, this));
    return this;
  };

  startSeries<ACTION_CLASS extends Action<ACTION_IN, ACTION_OUT>, ACTION_IN, ACTION_OUT, SERIES_OUT>
  (actionClass: ActionConstructor<ACTION_CLASS, ACTION_IN, ACTION_OUT>): SeriesPipe<ACTION_IN, SERIES_OUT> {
    // ----- Declaration separator ----- //
    const seriesPipe = SeriesPipe.start<ACTION_CLASS, ACTION_IN, ACTION_OUT, SERIES_OUT>(actionClass, this);
    this._pipes.push(seriesPipe);
    return seriesPipe;
  };

  startParallel<ACTION_CLASS extends Action<ACTION_IN, ACTION_OUT>, ACTION_IN, ACTION_OUT, PARALLEL_OUT>
  (actionClass: ActionConstructor<ACTION_CLASS, ACTION_IN, ACTION_OUT>): ParallelPipe<ACTION_IN, PARALLEL_OUT> {
    // ----- Declaration separator ----- //
    const parallelPipe = ParallelPipe.start<ACTION_CLASS, ACTION_IN, ACTION_OUT, PARALLEL_OUT>(actionClass, this);
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
      this.log.info(`...pipeline ${this.name} completed ${startTimingSuccessful ? endTiming(timingMark,this.log):''}`);
      return outputPayload;
    } catch (err) {
      this.log.info(`...pipeline ${this.name} failed`, 'error');
      if (isExecutionResult(err)) {
        if (isSettledRejected(err.settled)) {
          if (Array.isArray(err.settled.reason)) {
            err.settled.reason.forEach(reason => {
              this.log.error(reason);
            });
          } else {
            this.log.error(err.settled.reason);
          }
          throw new Error('handled');
        } else {
          throw new Error('Unreachable code');
        }
      } else {
        const error = processUnknownError(err);
        this.log.error(error);
        throw error;
      }
    } finally {
      clearTiming(timingMark);
    }
  }
}

