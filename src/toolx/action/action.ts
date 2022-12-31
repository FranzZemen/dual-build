/*
Created by Franz Zemen 12/03/2022
License Type: MIT
*/


import {NestedLog} from '../log/nested-log.js';
import {DefaultPayload} from '../pipeline/pipeline-aliases.js';
import {endTiming, startTiming} from '../util/timing.js';
import {processUnknownError} from '../util/process-unknown-error-message.js'

export type ActionConstructor<CLASS extends Action<PAYLOAD, IN, OUT>, PAYLOAD = DefaultPayload, IN = undefined, OUT = undefined> = new <PAYLOAD, IN, OUT>(logDepth: number) => CLASS;


export abstract class Action<PAYLOAD, IN, OUT> {
  protected log: NestedLog;
  protected errorCondition = false;
  protected constructor(protected depth: number) {
    this.log = new NestedLog(depth);
  }
  set logDepth(depth: number) {
    this.log.depth = depth;
  }


  async execute(payload: IN, payloadOverride?: PAYLOAD): Promise<OUT> {
    const actionContext = this.actionContext(payloadOverride ? payloadOverride: payload);
    this.log.info(`action ${this.name}${actionContext.length ? ' on ' + actionContext : ''} starting...`);

    let startTimingSuccessful: boolean = true;
    const timingMark = `Timing ${Action.name}:${this.name}.execute`;
    try {
      //const startTimingSuccessful = this.startTiming('execute');
      startTimingSuccessful = startTiming(timingMark, this.log);
      return await this.executeImpl(payloadOverride ? payloadOverride: payload);
    } catch (err) {
      return Promise.reject(processUnknownError(err));
    } finally {
      this.log.info(`...action ${this.name} ${this.errorCondition ? 'failed' : 'completed'} ${startTimingSuccessful ? endTiming(timingMark, this.log) : ''}`, this.errorCondition ? 'error' : 'info');
    }
  }
  abstract executeImpl(payload:IN | PAYLOAD): Promise<OUT>;
  abstract actionContext(payload: IN | PAYLOAD): string;
  get name(): string {
    return this.constructor.name;
  }
}
