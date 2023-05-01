import _ from 'lodash';
import {Log} from '../log/log.js';
import {Transform, TransformConstructor} from '../transform/index.js';
import {processUnknownError} from '../util/index.js';
import {Pipe} from './pipe.js';
import {Pipeline} from './pipeline.js';


export type MergeFunction<T> = (parallelPayloads: any[]) => Promise<T>;
export type MergeType = 'void' | 'asAttributes' | 'asMerged' | 'asMergeFunction' | 'asPipedIn';

export class ParallelPipe<PARALLEL_IN, PARALLEL_OUT = PARALLEL_IN> implements Pipe<PARALLEL_IN, PARALLEL_OUT>{
  log: Log;
  protected _pipe: [transform: Transform<any, any, any>, payloadOverride: any][] = [];
  protected _mergeStrategy: [mergeType: MergeType, mergeFunction?: MergeFunction<PARALLEL_OUT>] = ['asAttributes'];
  protected _mergeFunction: MergeFunction<PARALLEL_OUT> | undefined;

  protected constructor(protected _pipeline: Pipeline<any, any>, depth: number) {
    this.log = new Log(depth);
  }


  public copy(pipeline:Pipeline<any, any>): Pipe<PARALLEL_IN, PARALLEL_OUT> {
    const parallelPipe = new ParallelPipe<PARALLEL_IN, PARALLEL_OUT>(pipeline, pipeline.log.depth + 1);

    parallelPipe._pipe = this._pipe.map(([transform, payloadOverride]) => [transform.copy(), _.cloneDeep(payloadOverride)]);
    parallelPipe._mergeStrategy = _.cloneDeep(this._mergeStrategy);
    parallelPipe._mergeFunction = this._mergeFunction;
    return parallelPipe;
  }


  static start<
    TRANSFORM_CLASS extends Transform<any, any, any>,
    PASSED_IN,
    PARALLEL_IN,
    PARALLEL_OUT = PARALLEL_IN,
    CONSTRUCTOR extends TransformConstructor<TRANSFORM_CLASS> = TransformConstructor<TRANSFORM_CLASS>>(constructor: CONSTRUCTOR,
              pipeline: Pipeline<any, any>,
              payloadOverride?: PASSED_IN): ParallelPipe<PARALLEL_IN, PARALLEL_OUT> {

    // ----- Multiline Declaration Separator ----- //
    const pipe = new ParallelPipe<PARALLEL_IN, PARALLEL_OUT>(pipeline, pipeline.log.depth + 1);
    return pipe.parallel<TRANSFORM_CLASS, PASSED_IN, CONSTRUCTOR>(constructor, payloadOverride);
  }

  parallel<
    TRANSFORM_CLASS extends Transform<any, any, any>,
    PASSED_IN = undefined,
    CONSTRUCTOR extends TransformConstructor<TRANSFORM_CLASS> = TransformConstructor<TRANSFORM_CLASS>>(
    constructor: CONSTRUCTOR,
    payloadOverride?: PASSED_IN): ParallelPipe<PARALLEL_IN, PARALLEL_OUT> {
    // ----- Multiline Declaration Separator ----- //
    this._pipe.push([new constructor(this.log.depth + 1), payloadOverride]);
    return this;
  }

  endParallel<
    TRANSFORM_CLASS extends Transform<any, any, any>,
    PASSED_IN = undefined, CONSTRUCTOR extends TransformConstructor<TRANSFORM_CLASS> = TransformConstructor<TRANSFORM_CLASS>>(constructor: CONSTRUCTOR,
                     mergeStrategy: [mergeType: MergeType, mergeFunction?: MergeFunction<PARALLEL_OUT>] = ['asPipedIn'],
                     payloadOverride?: any): Pipeline<any, any> {
    // ----- Multiline Declaration Separator ----- //
    this._pipe.push([new constructor(this.log.depth + 1), payloadOverride]);
    this._mergeStrategy = mergeStrategy;
    return this._pipeline;
  }

  async execute(pipeIn: PARALLEL_IN): Promise<PARALLEL_OUT> {
    this.log.info('starting parallel pipe...', 'pipeline');

    const transformPromises: Promise<any>[] = [];
    try {
      for (let i = 0; i < this._pipe.length; i++) {
        const thisPipeI = this._pipe[i];
        if(thisPipeI !== undefined) {
          const [transform, payloadOverride]: [Transform<any, any, any>, any] = thisPipeI;
          transformPromises.push(transform.execute(pipeIn, payloadOverride));
        }
      }
      const settlement = await Promise.allSettled(transformPromises);
      let filteredErrors = settlement.filter(settled => settled.status === 'rejected');
      if (filteredErrors.length) {
        return Promise.reject(processUnknownError(filteredErrors, this.log));
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
                  // @ts-ignore
                  output[self._pipe[ndx][0].constructor.name + (ndx === 0 ? '' : `_${ndx}`) as keyof PARALLEL_OUT] = settled.value;
                }
              }
            });
            return output as unknown as PARALLEL_OUT;

          case 'void': {
            return undefined as PARALLEL_OUT;
          }
          case 'asPipedIn': {
            // Ignore any payload from parallel transforms and return what was piped in.
            return pipeIn as unknown as PARALLEL_OUT;
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
      return Promise.reject(processUnknownError(err, this.log));
    } finally {
      this.log.info('...completing paralell pipe', 'pipeline');
    }
  }
}
