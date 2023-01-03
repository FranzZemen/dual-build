/*
Created by Franz Zemen 12/03/2022
License Type: MIT
*/


import {Log} from '../log/log.js';
import {DefaultPayload} from '../pipeline/pipeline-aliases.js';
import {processUnknownError} from '../util/process-unknown-error-message.js';
import {endTiming, startTiming} from '../util/timing.js';

export type TransformConstructor<CLASS extends Transform<PAYLOAD, IN, OUT>, PAYLOAD = DefaultPayload, IN = undefined, OUT = undefined> = new (logDepth: number) => CLASS;


export abstract class Transform<PAYLOAD, IN, OUT> {
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
    const transformContext = this.transformContext(payload, payloadOverride);
    this.log.info(`transform ${this.name}${transformContext.length ? ' on ' + transformContext : ''} starting...`);
    let startTimingSuccessful: boolean = true;
    const timingMark = `Timing ${Transform.name}:${transformContext}:${this.name}.execute`;
    try {
      startTimingSuccessful = startTiming(timingMark, this.log);
      let payloadImpl: IN | PAYLOAD | undefined  = payload;
      if(payload === undefined) {
        payloadImpl = payloadOverride;
      }
      return await this.executeImpl(payloadImpl, payloadOverride);
    } catch (err) {
      return Promise.reject(processUnknownError(err));
    } finally {
      this.log.info(`...transform ${this.name}${transformContext.length ? ' on ' + transformContext : ''} ${this.errorCondition ? 'failed' : 'completed'} ${startTimingSuccessful ? endTiming(
        timingMark,
        this.log) : ''}`, this.errorCondition ? 'error' : 'task-done');
    }
  }

  abstract executeImpl(payload: IN | PAYLOAD | undefined, payloadOverride?: PAYLOAD): Promise<OUT>;

  abstract transformContext(payload: IN | PAYLOAD| undefined, payloadOverride?: PAYLOAD): string;
}
