import _ from 'lodash';
import {Action, ActionConstructor} from '../action/action.js';
import {Log} from '../log/log.js';
import {processUnknownError} from '../util/process-unknown-error-message.js';
import {DefaultPayload} from './pipeline-aliases.js';
import {Pipeline} from './pipeline.js';


export type MergeFunction<T> = (parallelPayloads: any[]) => Promise<T>;
export type MergeType = 'asAttributes' | 'asMerged';

export class ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT> {
  protected _pipe: [action: Action<any, any, any>, payloadOverride: any][] = [];
  protected _mergeStrategy: MergeType | MergeFunction<PARALLEL_OUT> = 'asAttributes';
  log:Log

  protected constructor(protected _pipeline: Pipeline<any, any>, depth: number) {
    this.log = new Log(depth);
  }

  static start<
    ACTION_CLASS extends Action<PAYLOAD, ACTION_IN, ACTION_OUT>,
    PAYLOAD = DefaultPayload,
    PIPELINE_IN = undefined,
    PIPELINE_OUT = void,
    PARALLEL_IN = undefined,
    PARALLEL_OUT = void,
    ACTION_IN = undefined,
    ACTION_OUT = void>(actionClass: ActionConstructor<ACTION_CLASS, PAYLOAD, ACTION_IN, ACTION_OUT>,
                       pipeline: Pipeline<any, any>,
                       payloadOverride?: PAYLOAD): ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT> {

    // ----- Multiline Declaration Separator ----- //
    const pipe = new ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT>(pipeline, pipeline.log.depth + 1);
    return pipe.parallel<ACTION_CLASS, PAYLOAD, ACTION_IN, ACTION_OUT>(actionClass, payloadOverride);
  }

  parallel<
    ACTION_CLASS extends Action<PAYLOAD, ACTION_IN, ACTION_OUT>,
    PAYLOAD = DefaultPayload,
    ACTION_IN = undefined,
    ACTION_OUT = void>(
    actionClass: ActionConstructor<ACTION_CLASS, PAYLOAD, ACTION_IN, ACTION_OUT>,
    payloadOverride?: PAYLOAD): ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT> {
    // ----- Multiline Declaration Separator ----- //
    this._pipe.push([new actionClass(this.log.depth + 1), payloadOverride]);
    return this;
  }

  endParallel<
    ACTION_CLASS extends Action<PAYLOAD, ACTION_IN, ACTION_OUT>,
    PAYLOAD = DefaultPayload,
    ACTION_IN = undefined,
    ACTION_OUT = void>(actionClass: ActionConstructor<ACTION_CLASS, PAYLOAD, ACTION_IN, ACTION_OUT>,
                       mergeStrategy: MergeType | MergeFunction<PARALLEL_OUT> = 'asAttributes',
                       payloadOverride?: any): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    // ----- Multiline Declaration Separator ----- //
    this._pipe.push([new actionClass(this.log.depth + 1), payloadOverride]);
    this._mergeStrategy = mergeStrategy;
    return this._pipeline;
  }

  async execute(payload: PARALLEL_IN): Promise<PARALLEL_OUT> {
    this.log.info('starting parallel pipe...', 'pipeline');

    const actionPromises: Promise<any>[] = [];
    try {
      for (let i = 0; i < this._pipe.length; i++) {
        const [action, payloadOverride] = this._pipe[i];
        actionPromises.push(action.execute(payload, payloadOverride));
      }
      const settlement = await Promise.allSettled(actionPromises);
      let filteredErrors = settlement.filter(settled => settled.status === 'rejected');
      if (filteredErrors.length) {
        return Promise.reject(processUnknownError(filteredErrors));
      } else {
        if (this._mergeStrategy === 'asAttributes') {
          let output: PARALLEL_OUT | Partial<PARALLEL_OUT> = {};
          settlement.forEach((settled, ndx) => {
            output[this._pipe[ndx].constructor.name as keyof PARALLEL_OUT] = settled.status === 'fulfilled' ? settled.value : 'Unreachable Code';
          });
          return output as unknown as PARALLEL_OUT;
        } else {
          const initialValue: any[] = [];
          const outputs = settlement.reduce((previousValue, currentValue) => {
            previousValue.push(currentValue.status === 'fulfilled' ? currentValue.value : 'Unreachable Code');
            return previousValue;
          }, initialValue);
          if (this._mergeStrategy === 'asMerged') {
            return _.merge({}, outputs) as unknown as PARALLEL_OUT;
          } else {
            return await this._mergeStrategy(outputs);
          }
        }
      }
    } catch (err) {
      return Promise.reject(processUnknownError(err));
    }
    finally {
       this.log.info('...completing paralell pipe', 'pipeline');
    }
  }
}
