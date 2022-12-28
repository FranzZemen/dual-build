/*
Created by Franz Zemen 12/03/2022
License Type: MIT
*/


import {NestedLog} from '../log/nested-log.js';
import {endTiming, startTiming} from '../util/timing.js';
import {processUnknownError} from '../util/process-unknown-error-message.js'

export type ActionConstructor<CLASS extends Action<IN, OUT>, IN, OUT> = new <IN,OUT>(logDepth?: number) => CLASS;


export abstract class Action<IN, OUT> {
  protected log: NestedLog;
  protected errorCondition = false;
  protected constructor(depth = 1, protected payload?: IN) {
    this.log = new NestedLog(depth);
  }
  set logDepth(depth: number) {
    this.log.depth = depth;
  }

  /**
   * When called directly from Action, executes a pipeline that contains only "this" action.
   * @param payload
   * @param bypass
   */
  async execute(payload: IN, bypass?: OUT): Promise<OUT> {
    this.log.info(`action ${this.name} starting...`);

    let startTimingSuccessful: boolean = true;
    const timingMark = `Timing ${Action.name}:${this.name}.execute`;
    try {
      //const startTimingSuccessful = this.startTiming('execute');
      startTimingSuccessful = startTiming(timingMark, this.log);
      return await this.executeImpl(payload, bypass);
    } catch (err) {
      return Promise.reject(processUnknownError(err));
    } finally {
      this.log.info(`...action ${this.name} ${this.errorCondition ? 'failed' : 'completed'} ${startTimingSuccessful ? endTiming(timingMark, this.log) : ''}`, this.errorCondition ? 'error' : 'info');
    }
  }
  abstract executeImpl(payload:IN, bypass?: OUT): Promise<OUT>;
  get name(): string {
    return this.constructor.name;
  }
}
