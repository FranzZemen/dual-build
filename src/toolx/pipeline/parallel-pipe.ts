import _ from 'lodash';
import {Action, ActionConstructor} from '../action/action.js';
import {processUnknownError} from '../util/process-unknown-error-message.js';
import {Pipeline} from './pipeline.js';


export type MergeFunction<T> = (parallelPayloads: any[]) => Promise<T>;
export type MergeType = 'asAttributes' | 'asMerged';

export class ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT> {
  protected _pipe: Action<any, any>[] = [];
  protected _mergeStrategy: MergeType | MergeFunction<PARALLEL_OUT> = 'asAttributes';

  protected constructor(protected _pipeline: Pipeline<any, any>) {
  }

  static start<
    ACTION_CLASS extends Action<PARALLEL_IN, ACTION_OUT>,
    PIPELINE_IN,
    PIPELINE_OUT,
    PARALLEL_IN,
    PARALLEL_OUT,
    ACTION_OUT>(actionClass: ActionConstructor<ACTION_CLASS, PARALLEL_IN, ACTION_OUT>, pipeline: Pipeline<any, any>)
    : ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT> {
    // ----- Multiline Declaration Separator ----- //
    const pipe = new ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT>(pipeline);
    return pipe.parallel<ACTION_CLASS, ACTION_OUT>(actionClass);
  }

  parallel<ACTION_CLASS extends Action<PARALLEL_IN, ACTION_OUT>, ACTION_OUT>(
    actionClass: ActionConstructor<ACTION_CLASS, PARALLEL_IN, ACTION_OUT>): ParallelPipe<PIPELINE_IN, PIPELINE_OUT, PARALLEL_IN, PARALLEL_OUT> {
    // ----- Multiline Declaration Separator ----- //
    this._pipe.push(new actionClass(this._pipeline.logDepth + 1));
    return this;
  }

  endParallel<ACTION_CLASS extends Action<PARALLEL_IN, ACTION_OUT>, ACTION_OUT>(
    actionClass: ActionConstructor<ACTION_CLASS, PARALLEL_IN, ACTION_OUT>,
    mergeStrategy: MergeType | MergeFunction<PARALLEL_OUT> = 'asAttributes'): Pipeline<PIPELINE_IN, PIPELINE_OUT> {
    // ----- Multiline Declaration Separator ----- //
    this._pipe.push(new actionClass(this._pipeline.logDepth + 1));
    this._mergeStrategy = mergeStrategy;
    return this._pipeline;
  }

  async execute(payload: PARALLEL_IN): Promise<PARALLEL_OUT> {
    const actionPromises: Promise<any>[] = [];
    try {
      for (let i = 0; i < this._pipe.length; i++) {
        const action = this._pipe[i];
        //actionNames.push(action.constructor.name);
        actionPromises.push(action.execute(payload));
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
  }
}
