/*
Created by Franz Zemen 12/15/2022
License Type: 
*/

import {v4 as uuidV4} from 'uuid';
import {Action, ActionConstructor} from '../action/action.js';
import {Log} from '../log/log.js';
import {processUnknownError} from '../util/process-unknown-error-message.js';
import {clearTiming, endTiming, startTiming} from '../util/timing.js';
import {ActionPipe} from './action-pipe.js';
import {MergeFunction, MergeType, ParallelPipe} from './parallel-pipe.js';
import {DefaultPayload, PipelineOptions} from './pipeline-aliases.js';
import {SeriesPipe} from './series-pipe.js';


export type Pipe = ActionPipe<any, any, any> | SeriesPipe<any, any, any, any> | ParallelPipe<any, any, any, any>; // | TransformFunction<any, any>;

export type ArrayTwoOrMore<T> = [T, T, ...T[]];


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
  log: Log;
  name: string;
  logDepth: number;
  protected _pipes: Pipe[] = [];

  private constructor(options: PipelineOptions) {
    this.name = options.name;
    this.logDepth = options.logDepth;
    this.log = new Log(options.logDepth);
  }

  /**
   * If this is not called, the defaultOptions function will be use.
   *
   * @param options
   */
  static options<PIPELINE_IN = undefined, PIPELINE_OUT = void>(options?: PipelineOptions) {
    if (options === undefined) {
      options = defaultPipelineOptions();
    }
    return new Pipeline<PIPELINE_IN, PIPELINE_OUT>(options);
  }

  /**
   * Start the pipeline with an action
   * ACTION_CLASS extends Action = Action class (constructor)
   * Payload is DIRECTORIES = PIPELINE_IN by definition since it is the start of the pipeline
   * In general, action payload out != pipeline payload out
   *
   */
  static action<
    ACTION_CLASS extends Action<PAYLOAD, ACTION_IN, ACTION_OUT>,
    PAYLOAD = DefaultPayload,
    PIPELINE_IN = undefined,
    PIPELINE_OUT = void,
    ACTION_IN = undefined,
    ACTION_OUT = void>(
    actionClass: ActionConstructor<ACTION_CLASS, PAYLOAD, ACTION_IN, ACTION_OUT>,
    payloadOverride?: PAYLOAD): Pipeline<PIPELINE_IN, PIPELINE_OUT> {

    // ----- Declaration separator ----- //
    const options = defaultPipelineOptions();
    const pipeline = Pipeline.options<PIPELINE_IN, PIPELINE_OUT>(options);
    pipeline._pipes.push(ActionPipe.action<ACTION_CLASS, PAYLOAD, ACTION_IN, ACTION_OUT>(actionClass, pipeline, payloadOverride));
    return pipeline;
  };

  static actions<
    PIPELINE_IN = undefined,
    PIPELINE_OUT = void>(actionClasses: ActionConstructor<any> | ActionConstructor<any>[],
                         payloadOverrides?: any | any [],
                         options?: PipelineOptions): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    // ----- Declaration separator ----- //

    const pipeline = Pipeline.options<PIPELINE_IN, PIPELINE_OUT>(options);
    return pipeline.actions(actionClasses, payloadOverrides);
  }


  /**
   * Start the pipeline with a series
   * ACTION_CLASS extends Action = Action class (constructor)
   * Payload is DIRECTORIES = SERIES_IN = PIPELINE_IN by definition since it is the start of the pipeline
   * In general, action payload out != series out != pipeline payload out
   *
   */
  static startSeries<
    ACTION_CLASS extends Action<PAYLOAD, ACTION_IN, ACTION_OUT>,
    PAYLOAD = DefaultPayload,
    PIPELINE_IN = undefined,
    PIPELINE_OUT = void,
    SERIES_IN = undefined,
    SERIES_OUT = void,
    ACTION_IN = undefined,
    ACTION_OUT = void>(actionClass: ActionConstructor<ACTION_CLASS, PAYLOAD, ACTION_IN, ACTION_OUT>,
                       payloadOverride?: PAYLOAD): SeriesPipe<PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT> {
    // ----- Declaration separator ----- //
    const options = defaultPipelineOptions();
    const pipeline = Pipeline.options<PIPELINE_IN, PIPELINE_OUT>(options);
    const seriesPipe = SeriesPipe.start<
      ACTION_CLASS,
      PAYLOAD,
      PIPELINE_IN,
      PIPELINE_OUT,
      SERIES_IN,
      SERIES_OUT,
      ACTION_IN,
      ACTION_OUT>(actionClass, pipeline, payloadOverride);
    pipeline._pipes.push(seriesPipe);
    return seriesPipe;
  };

  static series<
    PIPELINE_IN = undefined,
    PIPELINE_OUT = void,
    SERIES_IN = undefined,
    SERIES_OUT = void>(actionClasses: ActionConstructor<any>[],
                       payloadOverrides: ArrayTwoOrMore<any | undefined> [],
                       options?: PipelineOptions): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    const pipeline = Pipeline.options<PIPELINE_IN, PIPELINE_OUT>(options);
    return pipeline.series<SERIES_IN, SERIES_OUT>(actionClasses, payloadOverrides);
  }

  static startParallel<
    ACTION_CLASS extends Action<PAYLOAD, ACTION_IN, ACTION_OUT>,
    PAYLOAD = DefaultPayload,
    PIPELINE_IN = undefined,
    PIPELINE_OUT = void,
    PARALLEL_IN = undefined,
    PARALLEL_OUT = void,
    ACTION_IN = undefined,
    ACTION_OUT = void, >(actionClass: ActionConstructor<ACTION_CLASS, PAYLOAD, ACTION_IN, ACTION_OUT>,
                         payloadOverride?: PAYLOAD): ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT> {
    // ----- Declaration separator ----- //
    const options = defaultPipelineOptions();
    const pipeline = Pipeline.options<PIPELINE_IN, PIPELINE_OUT>(options);
    const parallelPipe = ParallelPipe.start<
      ACTION_CLASS,
      PAYLOAD,
      PIPELINE_IN,
      PIPELINE_OUT,
      PARALLEL_IN,
      PARALLEL_OUT,
      ACTION_IN,
      ACTION_OUT>(actionClass, pipeline, payloadOverride);
    pipeline._pipes.push(parallelPipe);
    return parallelPipe;
  };

  static parallels<
    PIPELINE_IN = undefined,
    PIPELINE_OUT = void,
    PARALLEL_IN = undefined,
    PARALLEL_OUT = void>(actionClasses: ActionConstructor<any>[],
                         mergeStrategy: MergeType | MergeFunction<PARALLEL_OUT> = 'asAttributes',
                         payloadOverrides: ArrayTwoOrMore<any | undefined> [],
                         options?: PipelineOptions): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    const pipeline = Pipeline.options<PIPELINE_IN, PIPELINE_OUT>(options);
    return pipeline.parallels<PARALLEL_IN, PARALLEL_OUT>(actionClasses, mergeStrategy, payloadOverrides);
  }

  action<
    ACTION_CLASS extends Action<PAYLOAD, ACTION_IN, ACTION_OUT>,
    PAYLOAD = DefaultPayload,
    ACTION_IN = undefined,
    ACTION_OUT = void>(actionClass: ActionConstructor<ACTION_CLASS, PAYLOAD, ACTION_IN, ACTION_OUT>,
                       payloadOverride?: PAYLOAD): Pipeline<PIPELINE_IN, PIPELINE_OUT> {

    // ----- Declaration separator ----- //
    this._pipes.push(ActionPipe.action<ACTION_CLASS, PAYLOAD, ACTION_IN, ACTION_OUT>(actionClass, this, payloadOverride));
    return this;
  };

  actions(actionClasses: ActionConstructor<any> | ActionConstructor<any>[],
          payloadOverrides?: any | any []): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    if (Array.isArray(actionClasses)) {
      if (payloadOverrides) {
        if (Array.isArray(payloadOverrides)) {
          // Size of arrays must match, we are still 1:1 not mxn.
          if (actionClasses.length === payloadOverrides.length) {
            return actionClasses.reduce((previousValue: Pipeline<any, any>, currentValue: ActionConstructor<any>, currentIndex) => {
              return previousValue.action<any, any>(currentValue, payloadOverrides[currentIndex]);

            }, this);
          } else {
            throw new Error('actions:  action classes array and payload array do not match');
          }
        } else {
          return actionClasses.reduce((previousValue: Pipeline<any, any>, currentValue: ActionConstructor<any>) => {
            return previousValue.action<any, any>(currentValue, payloadOverrides);
          }, this);
        }
      } else {
        return actionClasses.reduce((previousValue: Pipeline<any, any>, currentValue: ActionConstructor<any>) => {
          return previousValue.action<any, undefined>(currentValue);
        }, this);
      }
    } else {
      if (payloadOverrides) {
        if (Array.isArray(payloadOverrides)) {
          return payloadOverrides.reduce((previousValue: Pipeline<PIPELINE_IN, PIPELINE_OUT>, currentValue: any) => {
            return previousValue.action<any, any>(actionClasses, currentValue);
          }, this);
        } else {
          return this.action<any, any>(actionClasses, payloadOverrides);
        }
      } else {
        return this.action<any, undefined>(actionClasses);
      }
    }
  }


  startSeries<
    ACTION_CLASS extends Action<PAYLOAD, ACTION_IN, ACTION_OUT>,
    PAYLOAD = DefaultPayload,
    SERIES_IN = undefined,
    SERIES_OUT = void,
    ACTION_IN = undefined,
    ACTION_OUT = void>(actionClass: ActionConstructor<ACTION_CLASS, PAYLOAD, ACTION_IN, ACTION_OUT>,
                       payloadOverride?: PAYLOAD): SeriesPipe<PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT> {

    // ----- Declaration separator ----- //
    const seriesPipe = SeriesPipe.start<
      ACTION_CLASS,
      PAYLOAD,
      PIPELINE_IN,
      PIPELINE_OUT,
      SERIES_IN,
      SERIES_OUT,
      ACTION_IN,
      ACTION_OUT>(actionClass,
                  this,
                  payloadOverride);
    this._pipes.push(seriesPipe);
    return seriesPipe;
  };

  series<
    SERIES_IN = undefined,
    SERIES_OUT = void>(actionClasses: ActionConstructor<any>[],
                       payloadOverrides: ArrayTwoOrMore<any | undefined> []): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    return actionClasses.reduce((previousValue: any, currentValue, currentIndex) => {
      // Even though ArrayTwoOrMore guards minimum length from a type perspective, let's put in a run time check.  We have to match lengths between
      // Arrays anyway
      if (actionClasses.length != payloadOverrides.length) {
        throw new Error('Array lengths do not match');
      } else if (payloadOverrides.length < 2) {
        throw new Error('Minimum array length is 2 for a series');
      }
      if (previousValue === undefined) {
        return this.startSeries<any, any, SERIES_IN, SERIES_OUT, any, any>(currentValue, payloadOverrides[currentIndex]);
      } else if (currentIndex === payloadOverrides?.length - 1) {
        return (previousValue as SeriesPipe<PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT>).endSeries<any, any, any, any>(currentValue,
                                                                                                                             payloadOverrides[currentIndex]);
      } else {
        return (previousValue as SeriesPipe<PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT>).series<any, any, any, any>(currentValue,
                                                                                                                          payloadOverrides[currentIndex]);
      }
    }, undefined);
  }


  startParallel<
    ACTION_CLASS extends Action<PAYLOAD, ACTION_IN, ACTION_OUT>,
    PAYLOAD = DefaultPayload,
    PARALELL_IN = undefined,
    PARALLEL_OUT = void,
    ACTION_IN = undefined,
    ACTION_OUT = void>(actionClass: ActionConstructor<ACTION_CLASS, PAYLOAD, ACTION_IN, ACTION_OUT>,
                       payloadOverride?: PAYLOAD): ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALELL_IN, PARALLEL_OUT> {
    // ----- Declaration separator ----- //
    const parallelPipe = ParallelPipe.start<
      ACTION_CLASS,
      PAYLOAD,
      PIPELINE_IN,
      PIPELINE_OUT,
      PARALELL_IN,
      PARALLEL_OUT,
      ACTION_IN,
      ACTION_OUT>(actionClass, this, payloadOverride);
    this._pipes.push(parallelPipe);
    return parallelPipe;
  };

  parallels<PARALLEL_IN, PARALLEL_OUT>(actionClasses: ActionConstructor<any>[],
                                       mergeStrategy: MergeType | MergeFunction<PARALLEL_OUT> = 'asAttributes',
                                       payloadOverrides: ArrayTwoOrMore<any | undefined> []): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    return actionClasses.reduce((previousValue: any, currentValue, currentIndex) => {
      if (actionClasses.length != payloadOverrides.length) {
        throw new Error('Array lengths do not match');
      } else if (payloadOverrides.length < 2) {
        throw new Error('Minimum array length is 2 for a parallel');
      }
      if (previousValue === undefined) {
        return this.startParallel<any, any, PARALLEL_IN, PARALLEL_OUT, any, any>(currentValue, payloadOverrides[currentIndex]);
      } else if (currentIndex === actionClasses.length - 1) {
        return (previousValue as ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT>).endParallel<any, any, any, any>(currentValue,
                                                                                                                                     mergeStrategy,
                                                                                                                                     payloadOverrides[currentIndex]);
      } else {
        return (previousValue as ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT>).parallel<any, any, any, any>(currentValue,
                                                                                                                                  payloadOverrides[currentIndex]);
      }
    }, undefined);
  }

  // Pipeline.options()
  // .forEach(directories, predicate or predicate array [], will take the last of 'action', 'series' , 'parallel', in nothing defaults to aciton

  async execute(payload: PIPELINE_IN): Promise<PIPELINE_OUT> {
    this.log.info(`starting pipeline ${this.name}...`, 'pipeline');

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
      this.log.info(`...pipeline ${this.name} completed ${startTimingSuccessful ? endTiming(timingMark, this.log) : ''}`, 'pipeline');
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

