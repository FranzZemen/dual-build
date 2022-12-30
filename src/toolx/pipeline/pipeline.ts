/*
Created by Franz Zemen 12/15/2022
License Type: 
*/

import {v4 as uuidV4} from 'uuid';
import {Action, ActionConstructor} from '../action/action.js';
import {NestedLog} from '../log/nested-log.js';
import {processUnknownError} from '../util/process-unknown-error-message.js';
import {clearTiming, endTiming, startTiming} from '../util/timing.js';
import {ActionPipe} from './action-pipe.js';
import {ParallelPipe} from './parallel-pipe.js';
import {DefaultPayload, PipelineOptions} from './pipeline-aliases.js';
import {SeriesPipe} from './series-pipe.js';


export type Pipe = ActionPipe<any, any> | SeriesPipe<any, any, any, any> | ParallelPipe<any, any, any, any>; // | TransformFunction<any, any>;


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
  protected static index = 1;
  log: NestedLog;
  name: string;
  logDepth: number;
  protected _pipes: Pipe[] = [];

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
  static options<PIPELINE_IN = DefaultPayload, PIPELINE_OUT = PIPELINE_IN>(options: PipelineOptions<PIPELINE_IN>) {
    return new Pipeline<PIPELINE_IN, PIPELINE_OUT>(options);
  }

  /**
   * Start the pipeline with an action
   * ACTION_CLASS extends Action = Action class (constructor)
   * Payload is ACTION_IN_AND_OUT = PIPELINE_IN by definition since it is the start of the pipeline
   * In general, action payload out != pipeline payload out
   *
   */
  static action<
    ACTION_CLASS extends Action<PIPELINE_IN, ACTION_OUT>,
    PIPELINE_IN = DefaultPayload,
    PIPELINE_OUT = PIPELINE_IN,
    ACTION_OUT = PIPELINE_IN>(
    actionClass: ActionConstructor<ACTION_CLASS, PIPELINE_IN, ACTION_OUT>)
    : Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    // ----- Declaration separator ----- //
    const options = defaultPipelineOptions();
    const pipeline = new Pipeline<PIPELINE_IN, PIPELINE_OUT>(options);
    pipeline._pipes.push(ActionPipe.action<ACTION_CLASS, PIPELINE_IN, ACTION_OUT>(actionClass, pipeline));
    return pipeline;
  };

  /**
   * Start the pipeline with a series
   * ACTION_CLASS extends Action = Action class (constructor)
   * Payload is ACTION_IN_AND_OUT = SERIES_IN = PIPELINE_IN by definition since it is the start of the pipeline
   * In general, action payload out != series out != pipeline payload out
   *
   */
  static startSeries<
    ACTION_CLASS extends Action<PIPELINE_IN, ACTION_OUT>,
    PIPELINE_IN = DefaultPayload,
    PIPELINE_OUT = PIPELINE_IN,
    SERIES_OUT = PIPELINE_IN,
    ACTION_OUT = PIPELINE_IN>(
    actionClass: ActionConstructor<ACTION_CLASS, PIPELINE_IN, ACTION_OUT>): SeriesPipe<PIPELINE_IN, PIPELINE_OUT, PIPELINE_IN, SERIES_OUT> {
    // ----- Declaration separator ----- //
    const options = defaultPipelineOptions();
    const pipeline = new Pipeline<PIPELINE_IN, PIPELINE_OUT>(options);
    const seriesPipe = SeriesPipe.start<ACTION_CLASS, PIPELINE_IN, PIPELINE_OUT, PIPELINE_IN, SERIES_OUT, ACTION_OUT>(actionClass, pipeline);
    pipeline._pipes.push(seriesPipe);
    return seriesPipe;
  };

  static startParallel<
    ACTION_CLASS extends Action<PIPELINE_IN, ACTION_OUT>,
    PIPELINE_IN = DefaultPayload,
    PIPELINE_OUT = PIPELINE_IN,
    PARALLEL_OUT = PIPELINE_IN,
    ACTION_OUT = PIPELINE_IN>(
    actionClass: ActionConstructor<ACTION_CLASS, PIPELINE_IN, ACTION_OUT>)
    : ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PIPELINE_IN, PARALLEL_OUT> {
    // ----- Declaration separator ----- //
    const options = defaultPipelineOptions();
    const pipeline = new Pipeline<PIPELINE_IN, PIPELINE_OUT>(options);
    const parallelPipe = ParallelPipe.start<ACTION_CLASS, PIPELINE_IN, PIPELINE_OUT, PIPELINE_IN, PARALLEL_OUT, ACTION_OUT>(actionClass, pipeline);
    pipeline._pipes.push(parallelPipe);
    return parallelPipe;
  };

  action<
    ACTION_CLASS extends Action<ACTION_IN, ACTION_OUT>,
    ACTION_IN = PIPELINE_IN,
    ACTION_OUT = PIPELINE_OUT>
  (actionClass: ActionConstructor<ACTION_CLASS, ACTION_IN, ACTION_OUT>): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    // ----- Declaration separator ----- //
    this._pipes.push(ActionPipe.action<ACTION_CLASS, ACTION_IN, ACTION_OUT>(actionClass, this));
    return this;
  };

  startSeries<
    ACTION_CLASS extends Action<SERIES_IN, ACTION_OUT>,
    SERIES_IN = PIPELINE_IN,
    SERIES_OUT = PIPELINE_OUT,
    ACTION_OUT = SERIES_IN>(
    actionClass: ActionConstructor<ACTION_CLASS, SERIES_IN, ACTION_OUT>): SeriesPipe<PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT> {
    // ----- Declaration separator ----- //
    const seriesPipe = SeriesPipe.start<ACTION_CLASS, PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT, ACTION_OUT>(actionClass, this);
    this._pipes.push(seriesPipe);
    return seriesPipe;
  };

  startParallel<
    ACTION_CLASS extends Action<PARALELL_IN, ACTION_OUT>,
    PARALELL_IN = PIPELINE_IN,
    PARALLEL_OUT = PIPELINE_OUT,
    ACTION_OUT = PARALELL_IN>
  (actionClass: ActionConstructor<ACTION_CLASS, PARALELL_IN, ACTION_OUT>): ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALELL_IN, PARALLEL_OUT> {
    // ----- Declaration separator ----- //
    const parallelPipe = ParallelPipe.start<ACTION_CLASS, PIPELINE_IN, PIPELINE_OUT, PARALELL_IN, PARALLEL_OUT, ACTION_OUT>(actionClass, this);
    this._pipes.push(parallelPipe);
    return parallelPipe;
  };


  async execute(payload: PIPELINE_IN): Promise<PIPELINE_OUT> {
    this.log.info(`starting pipeline ${this.name}...`);

    const timingMark = `Timing ${Pipeline.name}:${this.name}.execute`;
    const startTimingSuccessful = startTiming(timingMark, this.log);

    let inputPayload = payload;
    let outputPayload: PIPELINE_OUT | undefined;
    // const results: ExecutionResult<any, any, any, any> [] = [];
    try {
      for (let i = 0; i < this._pipes.length; i++) {
        const pipe: Pipe = this._pipes[i];
        let result = await pipe.execute(inputPayload);
        inputPayload = result;
        outputPayload = result;
      }
      this.log.info(`...pipeline ${this.name} completed ${startTimingSuccessful ? endTiming(timingMark, this.log) : ''}`);
      return (outputPayload ? outputPayload : 'Unreachable Code') as unknown as PIPELINE_OUT;
    } catch (err) {
      this.log.info(`...pipeline ${this.name} failed`, 'error');
      const error = processUnknownError(err);
      this.log.error(error);
      throw error;
    } finally {
      clearTiming(timingMark);
    }
  }
}

