/*
Created by Franz Zemen 12/03/2022
License Type: MIT
*/


import {Log} from '../log/log.js';
import {DefaultPayload} from '../pipeline/pipeline-aliases.js';
import {processUnknownError} from '../util/process-unknown-error-message.js';
import {endTiming, startTiming} from '../util/timing.js';

export type ActionConstructor<CLASS extends Action<PAYLOAD, IN, OUT>, PAYLOAD = DefaultPayload, IN = undefined, OUT = undefined> = new <PAYLOAD, IN, OUT>(logDepth: number) => CLASS;


export abstract class Action<PAYLOAD, IN, OUT> {
  protected log: Log;
  protected errorCondition = false;

  protected constructor(protected depth: number) {
    this.log = new Log(depth);
  }

  set logDepth(depth: number) {
    this.log.depth = depth;
  }

  get name(): string {
    return this.constructor.name;
  }

  async execute(payload: IN, payloadOverride?: PAYLOAD): Promise<OUT> {
    const actionContext = this.actionContext(payloadOverride ? payloadOverride : payload);
    this.log.info(`action ${this.name}${actionContext.length ? ' on ' + actionContext : ''} starting...`);
    let startTimingSuccessful: boolean = true;
    const timingMark = `Timing ${Action.name}:${actionContext}:${this.name}.execute`;
    try {
      startTimingSuccessful = startTiming(timingMark, this.log);
      return await this.executeImpl(payloadOverride ? payloadOverride : payload);
    } catch (err) {
      return Promise.reject(processUnknownError(err));
    } finally {
      this.log.info(`...action ${this.name}${actionContext.length ? ' on ' + actionContext : ''} ${this.errorCondition ? 'failed' : 'completed'} ${startTimingSuccessful ? endTiming(
        timingMark,
        this.log) : ''}`, this.errorCondition ? 'error' : 'task-done');
    }
  }

  abstract executeImpl(payload: IN | PAYLOAD): Promise<OUT>;

  abstract actionContext(payload: IN | PAYLOAD): string;
}
