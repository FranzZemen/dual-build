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
import {DefaultPayload, Pipe, PipelineOptions} from './pipeline-aliases.js';
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
 * PIPELINE_IN = The payload starting the pipeline
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
  static options<PIPELINE_IN = undefined, PIPELINE_OUT = void>(options?: PipelineOptions) {
    if (options === undefined) {
      options = defaultPipelineOptions();
    }
    return new Pipeline<PIPELINE_IN, PIPELINE_OUT>(options);
  }

  /**
   * Start the pipeline with an transform
   * TRANSFORM_CLASS extends Transform = Transform class (constructor)
   * Payload is DIRECTORIES = PIPELINE_IN by definition since it is the start of the pipeline
   * In general, transform payload out != pipeline payload out
   *
   */
  static transform<
    CLASS extends Transform<PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
    PAYLOAD = DefaultPayload,
    PIPELINE_IN = undefined,
    PIPELINE_OUT = void,
    TRANSFORM_IN = undefined,
    TRANSFORM_OUT = void>(
    transformClass: TransformConstructor<CLASS, PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
    payloadOverride?: PAYLOAD): Pipeline<PIPELINE_IN, PIPELINE_OUT> {

    // ----- Declaration separator ----- //
    const options = defaultPipelineOptions();
    const pipeline = Pipeline.options<PIPELINE_IN, PIPELINE_OUT>(options);
    pipeline._pipes.push(TransformPipe.transform<CLASS, PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>(transformClass, pipeline, payloadOverride));
    return pipeline;
  };

  static transforms<
    PIPELINE_IN = undefined,
    PIPELINE_OUT = void>(transformClasses: TransformConstructor<any> | TransformConstructor<any>[],
                         payloadOverrides?: any | any [],
                         options?: PipelineOptions): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    // ----- Declaration separator ----- //

    const pipeline = Pipeline.options<PIPELINE_IN, PIPELINE_OUT>(options);
    return pipeline.transforms(transformClasses, payloadOverrides);
  }


  /**
   * Start the pipeline with a series
   * TRANSFORM_CLASS extends Transform = Transform class (constructor)
   * Payload is DIRECTORIES = SERIES_IN = PIPELINE_IN by definition since it is the start of the pipeline
   * In general, transform payload out != series out != pipeline payload out
   *
   */
  static startSeries<
    TRANSFORM_CLASS extends Transform<PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
    PAYLOAD = DefaultPayload,
    PIPELINE_IN = undefined,
    PIPELINE_OUT = void,
    SERIES_IN = undefined,
    SERIES_OUT = void,
    TRANSFORM_IN = undefined,
    TRANSFORM_OUT = void>(transformClass: TransformConstructor<TRANSFORM_CLASS, PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
                       payloadOverride?: PAYLOAD): SeriesPipe<PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT> {
    // ----- Declaration separator ----- //
    const options = defaultPipelineOptions();
    const pipeline = Pipeline.options<PIPELINE_IN, PIPELINE_OUT>(options);
    const seriesPipe = SeriesPipe.start<
      TRANSFORM_CLASS,
      PAYLOAD,
      PIPELINE_IN,
      PIPELINE_OUT,
      SERIES_IN,
      SERIES_OUT,
      TRANSFORM_IN,
      TRANSFORM_OUT>(transformClass, pipeline, payloadOverride);
    pipeline._pipes.push(seriesPipe);
    return seriesPipe;
  };

  static series<
    PIPELINE_IN = undefined,
    PIPELINE_OUT = void,
    SERIES_IN = undefined,
    SERIES_OUT = void>(transformClasses: TransformConstructor<any>[],
                       payloadOverrides: ArrayTwoOrMore<any | undefined> [],
                       options?: PipelineOptions): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    const pipeline = Pipeline.options<PIPELINE_IN, PIPELINE_OUT>(options);
    return pipeline.series<SERIES_IN, SERIES_OUT>(transformClasses, payloadOverrides);
  }

  static startParallel<
    TRANSFORM_CLASS extends Transform<PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
    PAYLOAD = DefaultPayload,
    PIPELINE_IN = undefined,
    PIPELINE_OUT = void,
    PARALLEL_IN = undefined,
    PARALLEL_OUT = void,
    TRANSFORM_IN = undefined,
    TRANSFORM_OUT = void, >(transformClass: TransformConstructor<TRANSFORM_CLASS, PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
                         payloadOverride?: PAYLOAD): ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT> {
    // ----- Declaration separator ----- //
    const options = defaultPipelineOptions();
    const pipeline = Pipeline.options<PIPELINE_IN, PIPELINE_OUT>(options);
    const parallelPipe = ParallelPipe.start<
      TRANSFORM_CLASS,
      PAYLOAD,
      PIPELINE_IN,
      PIPELINE_OUT,
      PARALLEL_IN,
      PARALLEL_OUT,
      TRANSFORM_IN,
      TRANSFORM_OUT>(transformClass, pipeline, payloadOverride);
    pipeline._pipes.push(parallelPipe);
    return parallelPipe;
  };

  static parallels<
    PIPELINE_IN = undefined,
    PIPELINE_OUT = void,
    PARALLEL_IN = undefined,
    PARALLEL_OUT = void>(transformClasses: TransformConstructor<any>[],
                         mergeStrategy: [mergeType: MergeType, mergeFunction?:MergeFunction<PARALLEL_OUT>] = ['asAttributes'],
                         payloadOverrides: ArrayTwoOrMore<any | undefined> [],
                         options?: PipelineOptions): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    const pipeline = Pipeline.options<PIPELINE_IN, PIPELINE_OUT>(options);
    return pipeline.parallels<PARALLEL_IN, PARALLEL_OUT>(transformClasses, mergeStrategy, payloadOverrides);
  }

  transform<
    TRANSFORM_CLASS extends Transform<PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
    PAYLOAD = DefaultPayload,
    TRANSFORM_IN = undefined,
    TRANSFORM_OUT = void>(transformClass: TransformConstructor<TRANSFORM_CLASS, PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
                       payloadOverride?: PAYLOAD): Pipeline<PIPELINE_IN, PIPELINE_OUT> {

    // ----- Declaration separator ----- //
    this._pipes.push(TransformPipe.transform<TRANSFORM_CLASS, PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>(transformClass, this, payloadOverride));
    return this;
  };

  transforms(transformClasses: TransformConstructor<any> | TransformConstructor<any>[],
             payloadOverrides?: any | any []): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    if (Array.isArray(transformClasses)) {
      if (payloadOverrides) {
        if (Array.isArray(payloadOverrides)) {
          // Size of arrays must match, we are still 1:1 not mxn.
          if (transformClasses.length === payloadOverrides.length) {
            return transformClasses.reduce((previousValue: Pipeline<any, any>, currentValue: TransformConstructor<any>, currentIndex) => {
              return previousValue.transform<any, any>(currentValue, payloadOverrides[currentIndex]);

            }, this);
          } else {
            throw new Error('transforms:  transform classes array and payload array do not match');
          }
        } else {
          return transformClasses.reduce((previousValue: Pipeline<any, any>, currentValue: TransformConstructor<any>) => {
            return previousValue.transform<any, any>(currentValue, payloadOverrides);
          }, this);
        }
      } else {
        return transformClasses.reduce((previousValue: Pipeline<any, any>, currentValue: TransformConstructor<any>) => {
          return previousValue.transform<any, undefined>(currentValue);
        }, this);
      }
    } else {
      if (payloadOverrides) {
        if (Array.isArray(payloadOverrides)) {
          return payloadOverrides.reduce((previousValue: Pipeline<PIPELINE_IN, PIPELINE_OUT>, currentValue: any) => {
            return previousValue.transform<any, any>(transformClasses, currentValue);
          }, this);
        } else {
          return this.transform<any, any>(transformClasses, payloadOverrides);
        }
      } else {
        return this.transform<any, undefined>(transformClasses);
      }
    }
  }


  startSeries<
    TRANSFORM_CLASS extends Transform<PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
    PAYLOAD = DefaultPayload,
    SERIES_IN = undefined,
    SERIES_OUT = void,
    TRANSFORM_IN = undefined,
    TRANSFORM_OUT = void>(transformClass: TransformConstructor<TRANSFORM_CLASS, PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
                       payloadOverride?: PAYLOAD): SeriesPipe<PIPELINE_IN, PIPELINE_OUT, SERIES_IN, SERIES_OUT> {

    // ----- Declaration separator ----- //
    const seriesPipe = SeriesPipe.start<
      TRANSFORM_CLASS,
      PAYLOAD,
      PIPELINE_IN,
      PIPELINE_OUT,
      SERIES_IN,
      SERIES_OUT,
      TRANSFORM_IN,
      TRANSFORM_OUT>(transformClass,
                  this,
                  payloadOverride);
    this._pipes.push(seriesPipe);
    return seriesPipe;
  };

  series<
    SERIES_IN = undefined,
    SERIES_OUT = void>(transformClasses: TransformConstructor<any>[],
                       payloadOverrides: ArrayTwoOrMore<any | undefined> []): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    return transformClasses.reduce((previousValue: any, currentValue, currentIndex) => {
      // Even though ArrayTwoOrMore guards minimum length from a type perspective, let's put in a run time check.  We have to match lengths between
      // Arrays anyway
      if (transformClasses.length != payloadOverrides.length) {
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
    TRANSFORM_CLASS extends Transform<PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
    PAYLOAD = DefaultPayload,
    PARALELL_IN = undefined,
    PARALLEL_OUT = void,
    TRANSFORM_IN = undefined,
    TRANSFORM_OUT = void>(transformClass: TransformConstructor<TRANSFORM_CLASS, PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
                       payloadOverride?: PAYLOAD): ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALELL_IN, PARALLEL_OUT> {
    // ----- Declaration separator ----- //
    const parallelPipe = ParallelPipe.start<
      TRANSFORM_CLASS,
      PAYLOAD,
      PIPELINE_IN,
      PIPELINE_OUT,
      PARALELL_IN,
      PARALLEL_OUT,
      TRANSFORM_IN,
      TRANSFORM_OUT>(transformClass, this, payloadOverride);
    this._pipes.push(parallelPipe);
    return parallelPipe;
  };

  parallels<PARALLEL_IN, PARALLEL_OUT>(transformClasses: TransformConstructor<any>[],
                                       mergeStrategy: [type: MergeType, mergeFunction?: MergeFunction<PARALLEL_OUT>] = ['asAttributes'],
                                       payloadOverrides: ArrayTwoOrMore<any | undefined> []): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    return transformClasses.reduce((previousValue: any, currentValue, currentIndex) => {
      if (transformClasses.length != payloadOverrides.length) {
        throw new Error('Array lengths do not match');
      } else if (payloadOverrides.length < 2) {
        throw new Error('Minimum array length is 2 for a parallel');
      }
      if (previousValue === undefined) {
        return this.startParallel<any, any, PARALLEL_IN, PARALLEL_OUT, any, any>(currentValue, payloadOverrides[currentIndex]);
      } else if (currentIndex === transformClasses.length - 1) {
        return (previousValue as ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT>).endParallel<any, any, any, any>(currentValue,
                                                                                                                                     mergeStrategy,
                                                                                                                                     payloadOverrides[currentIndex]);
      } else {
        return (previousValue as ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT>).parallel<any, any, any, any>(currentValue,
                                                                                                                                  payloadOverrides[currentIndex]);
      }
    }, undefined);
  }


  // Pipeline.gitOptions()
  // .forEach(directories, predicate or predicate array [], will take the last of 'transform', 'series' , 'parallel', in nothing defaults to aciton

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

