/*
Created by Franz Zemen 12/15/2022
License Type: 
*/

import {v4 as uuidV4} from 'uuid';
import {Log} from '../log/log.js';
import {Transform, TransformConstructor} from '../transform/transform.js';
import {processUnknownError} from '../util/process-unknown-error-message.js';
import {clearTiming, endTiming, startTiming} from '../util/timing.js';
import {MergeFunction, MergeType, ParallelPipe} from './parallel-pipe.js';
import {Pipe, PipelineOptions} from './pipeline-aliases.js';
import {SeriesPipe} from './series-pipe.js';
import {TransformPipe} from './transform-pipe.js';


export type ArrayTwoOrMore<T> = [T, T, ...T[]];


export function defaultPipelineOptions(): PipelineOptions {
  return {
    name: `Pipeline-${uuidV4()}`,
    logDepth: 0
  };
}

/**
 * PIPELINE_SERIES_AND_PIPE_IN = The payload starting the pipeline
 * PIPELINE_OUT = The payload coming out of the pipeline
 */
export class Pipeline<PIPELINE_IN, PIPELINE_OUT> {
  protected static index = 1;
  log: Log;
  name: string;
  //logDepth: number;
  protected _pipes: Pipe[] = [];

  private constructor(options: PipelineOptions) {
    this.name = options.name;
    //this.logDepth = gitOptions.logDepth;
    this.log = new Log(options.logDepth);
  }

  /**
   * If this is not called, the defaultOptions function will be use.
   *
   * @param options
   */
  static options<PIPELINE_IN, PIPELINE_OUT>(options?: PipelineOptions) {
    if (options === undefined) {
      options = defaultPipelineOptions();
    }
    return new Pipeline<PIPELINE_IN, PIPELINE_OUT>(options);
  }

  /**
   * Start the pipeline with an transform
   * TRANSFORM_CLASS extends Transform = Transform class (constructor)
   * Payload is DIRECTORIES = PIPELINE_SERIES_AND_PIPE_IN by definition since it is the start of the pipeline
   * In general, transform payload out != pipeline payload out
   *
   */

  /*
  static transform<
    CLASS extends Transform<PASSED_IN, PIPE_IN, PIPE_OUT>,
    PASSED_IN = DefaultPayload,
    PIPELINE_IN = undefined,
    PIPELINE_OUT = void,
    PIPE_IN = undefined,
    PIPE_OUT = void>(
    transformClass: TransformConstructor<CLASS, PASSED_IN, PIPE_IN, PIPE_OUT>,
    passedIn?: PASSED_IN): Pipeline<PIPELINE_IN, PIPELINE_OUT> {

    // ----- Declaration separator ----- //
    const options = defaultPipelineOptions();
    const pipeline = Pipeline.options<PIPELINE_IN, PIPELINE_OUT>(options);
    pipeline._pipes.push(TransformPipe.transform<CLASS, PASSED_IN, PIPE_IN, PIPE_OUT>(transformClass, pipeline, passedIn));
    return pipeline;
  };
  
   
  static transforms<
    PIPELINE_IN = undefined,
    PIPELINE_OUT = void>(transformClasses: TransformConstructor<any> | TransformConstructor<any>[],
                         passedIns?: any | any [],
                         options?: PipelineOptions): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    // ----- Declaration separator ----- //

    const pipeline = Pipeline.options<PIPELINE_IN, PIPELINE_OUT>(options);
    return pipeline.transforms(transformClasses, passedIns);
  }



  static startSeries<
    TRANSFORM_CLASS extends Transform<PASSED_IN, PIPELINE_SERIES_AND_PIPE_IN, PIPE_OUT>,
    PASSED_IN = DefaultPayload,
    PIPELINE_SERIES_AND_PIPE_IN = undefined,
    PIPELINE_OUT = void,
    SERIES_OUT = void,
    PIPE_OUT = void>(transformClass: TransformConstructor<TRANSFORM_CLASS, PASSED_IN, PIPELINE_SERIES_AND_PIPE_IN, PIPE_OUT>,
                     passedIn?: PASSED_IN): SeriesPipe<PIPELINE_SERIES_AND_PIPE_IN, SERIES_OUT> {
    // ----- Declaration separator ----- //
    const options = defaultPipelineOptions();
    const pipeline = Pipeline.options<PIPELINE_SERIES_AND_PIPE_IN, PIPELINE_OUT>(options);
    const seriesPipe = SeriesPipe.start<
      TRANSFORM_CLASS,
      PASSED_IN,
      PIPELINE_SERIES_AND_PIPE_IN,
      SERIES_OUT,
      PIPE_OUT>(transformClass, pipeline, passedIn);
    pipeline._pipes.push(seriesPipe);
    return seriesPipe;
  };

  static series<
    PIPELINE_AND_SERIES_IN,
    PIPELINE_OUT,
    SERIES_OUT>(transformClasses: TransformConstructor<any>[],
                passedIns: ArrayTwoOrMore<any | undefined> [],
                options?: PipelineOptions): Pipeline<PIPELINE_AND_SERIES_IN, PIPELINE_OUT> {
    const pipeline = Pipeline.options<PIPELINE_AND_SERIES_IN, PIPELINE_OUT>(options);
    return pipeline.series<PIPELINE_AND_SERIES_IN, SERIES_OUT>(transformClasses, passedIns);
  }


  static startParallel<
    TRANSFORM_CLASS extends Transform<PASSED_IN, PIPELINE_PARALLEL_AND_PIPE_IN, PIPE_OUT>,
    PASSED_IN,
    PIPELINE_PARALLEL_AND_PIPE_IN,
    PIPELINE_OUT = void,
    PARALLEL_OUT = void,
    PIPE_OUT = void, >(transformClass: TransformConstructor<TRANSFORM_CLASS, PASSED_IN, PIPELINE_PARALLEL_AND_PIPE_IN, PIPE_OUT>,
                       passedIn?: PASSED_IN): ParallelPipe<PIPELINE_PARALLEL_AND_PIPE_IN, PARALLEL_OUT> {
    // ----- Declaration separator ----- //
    const options = defaultPipelineOptions();
    const pipeline = Pipeline.options<PIPELINE_PARALLEL_AND_PIPE_IN, PIPELINE_OUT>(options);
    const parallelPipe = ParallelPipe.start<
      TRANSFORM_CLASS,
      PASSED_IN,
      PIPELINE_PARALLEL_AND_PIPE_IN,
      PARALLEL_OUT,
      PIPE_OUT>(transformClass, pipeline, passedIn);
    pipeline._pipes.push(parallelPipe);
    return parallelPipe;
  };

  static parallels<
    PIPELINE_AND_PARALLEL_IN,
    PIPELINE_OUT,
    PARALLEL_OUT>(transformClasses: TransformConstructor<any>[],
                  mergeStrategy: [mergeType: MergeType, mergeFunction?: MergeFunction<PARALLEL_OUT>] = ['asAttributes'],
                  passedIns: ArrayTwoOrMore<any | undefined> [],
                  options?: PipelineOptions): Pipeline<PIPELINE_AND_PARALLEL_IN, PIPELINE_OUT> {
    const pipeline = Pipeline.options<PIPELINE_AND_PARALLEL_IN, PIPELINE_OUT>(options);
    return pipeline.parallels<PIPELINE_AND_PARALLEL_IN, PARALLEL_OUT>(transformClasses, mergeStrategy, passedIns);
  }
  */

  transform<TRANSFORM_CLASS extends Transform<any, any, any>, PASSED_IN, PIPE_IN, PIPE_OUT>(transformClass: TransformConstructor<TRANSFORM_CLASS>,
                                                                                            passedIn?: PASSED_IN): Pipeline<PIPELINE_IN, PIPELINE_OUT> {

    // ----- Declaration separator ----- //
    this._pipes.push(TransformPipe.transform<TRANSFORM_CLASS, PASSED_IN, PIPE_IN, PIPE_OUT>(transformClass, this, passedIn));
    return this;
  };

  transforms(transformClasses: TransformConstructor<any> | TransformConstructor<any>[],
             passedIns?: any | any []): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    if (Array.isArray(transformClasses)) {
      if (passedIns) {
        if (Array.isArray(passedIns)) {
          // Size of arrays must match, we are still 1:1 not mxn.
          if (transformClasses.length === passedIns.length) {
            return transformClasses.reduce((previousValue: Pipeline<any, any>,
                                            currentValue: TransformConstructor<any>,
                                            currentIndex) => {
              return previousValue.transform<any, any, any, any>(currentValue, passedIns[currentIndex]);

            }, this);
          } else {
            throw new Error('transforms:  transform classes array and payload array do not match');
          }
        } else {
          return transformClasses.reduce((previousValue: Pipeline<any, any>, currentValue: TransformConstructor<any>) => {
            return previousValue.transform<any, any, any, any>(currentValue, passedIns);
          }, this);
        }
      } else {
        return transformClasses.reduce((previousValue: Pipeline<any, any>, currentValue: TransformConstructor<any>) => {
          return previousValue.transform<any, any, any, any>(currentValue);
        }, this);
      }
    } else {
      if (passedIns) {
        if (Array.isArray(passedIns)) {
          return passedIns.reduce((previousValue: Pipeline<PIPELINE_IN, PIPELINE_OUT>, currentValue: any) => {
            return previousValue.transform<any, any, any, any>(transformClasses, currentValue);
          }, this);
        } else {
          return this.transform<any, any, any, any>(transformClasses, passedIns);
        }
      } else {
        return this.transform<any, any, any, any>(transformClasses);
      }
    }
  }


  startSeries<
    TRANSFORM_CLASS extends Transform<any, any, any>,
    PASSED_IN,
    SERIES_IN,
    SERIES_OUT>(transformClass: TransformConstructor<TRANSFORM_CLASS>,
                passedIn?: PASSED_IN): SeriesPipe<SERIES_IN, SERIES_OUT> {

    // ----- Declaration separator ----- //
    const seriesPipe = SeriesPipe.start<
      TRANSFORM_CLASS,
      PASSED_IN,
      SERIES_IN,
      SERIES_OUT>(transformClass, this, passedIn);
    this._pipes.push(seriesPipe);
    return seriesPipe;
  };

  series<
    SERIES_IN,
    SERIES_OUT>(transformClasses: TransformConstructor<any>[],
                passedIns: ArrayTwoOrMore<any | undefined> []): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    return transformClasses.reduce((previousValue: any, currentValue, currentIndex) => {
      // Even though ArrayTwoOrMore guards minimum length from a type perspective, let's put in a run time check.  We have to match lengths between
      // Arrays anyway
      if (transformClasses.length != passedIns.length) {
        throw new Error('Array lengths do not match');
      } else if (passedIns.length < 2) {
        throw new Error('Minimum array length is 2 for a series');
      }
      if (previousValue === undefined) {
        return this.startSeries<any, any, any, any>(currentValue, passedIns[currentIndex]);
      } else if (currentIndex === passedIns?.length - 1) {
        return (previousValue as SeriesPipe<SERIES_IN, SERIES_OUT>).endSeries<any, any>(currentValue,
                                                                                        passedIns[currentIndex]);
      } else {
        return (previousValue as SeriesPipe<SERIES_IN, SERIES_OUT>).series<any, any>(currentValue,
                                                                                     passedIns[currentIndex]);
      }
    }, undefined);
  }


  startParallel<
    TRANSFORM_CLASS extends Transform<any, any, any>,
    PASSED_IN,
    PARALLEL_IN,
    PARALLEL_OUT>(transformClass: TransformConstructor<TRANSFORM_CLASS>,
                  passedIn?: PASSED_IN): ParallelPipe<PARALLEL_IN, PARALLEL_OUT> {
    // ----- Declaration separator ----- //
    const parallelPipe = ParallelPipe.start<
      TRANSFORM_CLASS,
      PASSED_IN,
      PARALLEL_IN,
      PARALLEL_OUT>(transformClass, this, passedIn);
    this._pipes.push(parallelPipe);
    return parallelPipe;
  };

  parallels<PARALLEL_IN, PARALLEL_OUT>(transformClasses: TransformConstructor<any>[],
                                       mergeStrategy: [type: MergeType, mergeFunction?: MergeFunction<PARALLEL_OUT>] = ['asAttributes'],
                                       passedIns: ArrayTwoOrMore<any | undefined> []): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    return transformClasses.reduce((previousValue: any, currentValue, currentIndex) => {
      if (transformClasses.length != passedIns.length) {
        throw new Error('Array lengths do not match');
      } else if (passedIns.length < 2) {
        throw new Error('Minimum array length is 2 for a parallel');
      }
      if (previousValue === undefined) {
        return this.startParallel<any, any, any, any>(currentValue, passedIns[currentIndex]);
      } else if (currentIndex === transformClasses.length - 1) {
        return (previousValue as ParallelPipe<PARALLEL_IN, PARALLEL_OUT>).endParallel<any, any>(currentValue,
                                                                                                mergeStrategy,
                                                                                                passedIns[currentIndex]);
      } else {
        return (previousValue as ParallelPipe<PARALLEL_IN, PARALLEL_OUT>).parallel<any, any>(currentValue,
                                                                                             passedIns[currentIndex]);
      }
    }, undefined);
  }


  // Pipeline.gitOptions()
  // .forEach(directories, predicate or predicate array [], will take the last of 'transform', 'series' , 'parallel', in nothing defaults to aciton

  async execute(pipelineIn: PIPELINE_IN): Promise<PIPELINE_OUT> {
    this.log.info(`starting pipeline ${this.name}...`, 'pipeline');

    const timingMark = `Timing ${Pipeline.name}:${this.name}.execute`;
    const startTimingSuccessful = startTiming(timingMark, this.log);

    let inputPayload = pipelineIn;
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
      return outputPayload as PIPELINE_OUT;
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

