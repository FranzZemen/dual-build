import _ from 'lodash';
import {Log} from '../log/log.js';
import {Transform, TransformConstructor} from '../transform/transform.js';
import {processUnknownError} from '../util/process-unknown-error-message.js';
import {DefaultPayload} from './pipeline-aliases.js';
import {Pipeline} from './pipeline.js';


export type MergeFunction<T> = (parallelPayloads: any[]) => Promise<T>;
export type MergeType = 'void' | 'asAttributes' | 'asMerged' | 'asMergeFunction';

export class ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT> {
  log: Log;
  protected _pipe: [transform: Transform<any, any, any>, payloadOverride: any][] = [];
  protected _mergeStrategy: [mergeType: MergeType, mergeFunction?: MergeFunction<PARALLEL_OUT>] = ['asAttributes'];
  protected _mergeFunction: MergeFunction<PARALLEL_OUT> | undefined;

  protected constructor(protected _pipeline: Pipeline<any, any>, depth: number) {
    this.log = new Log(depth);
  }

  static start<
    TRANSFORM_CLASS extends Transform<PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
    PAYLOAD = DefaultPayload,
    PIPELINE_IN = undefined,
    PIPELINE_OUT = void,
    PARALLEL_IN = undefined,
    PARALLEL_OUT = void,
    TRANSFORM_IN = undefined,
    TRANSFORM_OUT = void>(transformClass: TransformConstructor<TRANSFORM_CLASS, PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
                          pipeline: Pipeline<any, any>,
                          payloadOverride?: PAYLOAD): ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT> {

    // ----- Multiline Declaration Separator ----- //
    const pipe = new ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT>(pipeline, pipeline.log.depth + 1);
    return pipe.parallel<TRANSFORM_CLASS, PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>(transformClass, payloadOverride);
  }

  parallel<
    TRANSFORM_CLASS extends Transform<PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
    PAYLOAD = DefaultPayload,
    TRANSFORM_IN = undefined,
    TRANSFORM_OUT = void>(
    transformClass: TransformConstructor<TRANSFORM_CLASS, PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
    payloadOverride?: PAYLOAD): ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT> {
    // ----- Multiline Declaration Separator ----- //
    this._pipe.push([new transformClass(this.log.depth + 1), payloadOverride]);
    return this;
  }

  endParallel<
    TRANSFORM_CLASS extends Transform<PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
    PAYLOAD = DefaultPayload,
    TRANSFORM_IN = undefined,
    TRANSFORM_OUT = void>(transformClass: TransformConstructor<TRANSFORM_CLASS, PAYLOAD, TRANSFORM_IN, TRANSFORM_OUT>,
                          mergeStrategy: [mergeType: MergeType, mergeFunction?: MergeFunction<PARALLEL_OUT>] = ['asAttributes'],
                          payloadOverride?: any): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    // ----- Multiline Declaration Separator ----- //
    this._pipe.push([new transformClass(this.log.depth + 1), payloadOverride]);
    this._mergeStrategy = mergeStrategy;
    return this._pipeline;
  }

  async execute(payload: PARALLEL_IN): Promise<PARALLEL_OUT> {
    this.log.info('starting parallel pipe...', 'pipeline');

    const transformPromises: Promise<any>[] = [];
    try {
      for (let i = 0; i < this._pipe.length; i++) {
        const [transform, payloadOverride] = this._pipe[i];
        transformPromises.push(transform.execute(payload, payloadOverride));
      }
      const settlement = await Promise.allSettled(transformPromises);
      let filteredErrors = settlement.filter(settled => settled.status === 'rejected');
      if (filteredErrors.length) {
        return Promise.reject(processUnknownError(filteredErrors));
      } else {
        switch (this._mergeStrategy[0]) {
          case 'asAttributes':
            let output: PARALLEL_OUT | Partial<PARALLEL_OUT> | undefined;
            const self = this;
            settlement.forEach((settled, ndx) => {
              if (settled.status === 'fulfilled') {
                if (settled.value !== undefined) {
                  if (output === undefined) {
                    output = {};
                  }
                  output[self._pipe[ndx][0].constructor.name + (ndx === 0 ? '' : `_${ndx}`) as keyof PARALLEL_OUT] = settled.value;
                }
              }
            });
            return output as unknown as PARALLEL_OUT;

          case 'void': {
            return undefined as PARALLEL_OUT;
          }
          case 'asMergeFunction':
          case 'asMerged': {
            //let initialValue: any[] | undefined = undefined;
            const outputs = settlement.reduce((previousValue: any[] | undefined, currentValue) => {
              if (currentValue.status === 'fulfilled') {
                if (currentValue.value !== undefined) {
                  if (previousValue === undefined) {
                    previousValue = [];
                  }
                  previousValue.push(currentValue);
                }
              }
              return previousValue;
            }, undefined);
            if (outputs === undefined) {
              return outputs as PARALLEL_OUT;
            } else if (this._mergeStrategy[0] === 'asMerged') {
              return _.merge({}, ...outputs) as unknown as PARALLEL_OUT;
            } else if (this._mergeStrategy[1]) {
              return this._mergeStrategy[1](outputs);
            } else {
              return Promise.reject(new Error(`Merge strategy is 'asMergeFunction' with undefined function`));
            }
          }
          default:
            return this._mergeStrategy[0] as never;
        }
      }
    } catch (err) {
      return Promise.reject(processUnknownError(err));
    } finally {
      this.log.info('...completing paralell pipe', 'pipeline');
    }
  }
}
