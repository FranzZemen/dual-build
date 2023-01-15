/*
Created by Franz Zemen 12/03/2022
License Type: MIT
*/


import {Log} from '../log/log.js';
import {processUnknownError} from '../util/process-unknown-error-message.js';
import {endTiming, startTiming} from '../util/timing.js';

export type TransformConstructor<CLASS extends Transform<any, any, any>> = new (logDepth: number) => CLASS;


export abstract class Transform<PASSED_IN, PIPE_IN, PIPE_OUT> {
  protected log: Log;
  protected errorCondition = false;

  protected constructor(protected depth: number) {
    this.log = new Log(depth);
  }

  set logDepth(depth: number) {
    this.log.depth = depth;
  }

  get logDepth(): number {
    return this.log.depth;
  }

  get name(): string {
    return this.constructor.name;
  }

  async execute(pipe_in: PIPE_IN, passedIn?: PASSED_IN): Promise<PIPE_OUT> {
    const transformContext = this.transformContext(pipe_in, passedIn);
    const maxLineLength = 100;
    if(`transform ${this.name}${transformContext.length ? ' on ' + transformContext : ''} starting...`.length  > maxLineLength) {
      this.log.info(`transform ${this.name}`);
      this.log.info(`  on ${transformContext} starting...`);
    } else {
      this.log.info(`transform ${this.name}${transformContext.length ? ' on ' + transformContext : ''} starting...`);
    }
    let startTimingSuccessful: boolean = true;
    const timingMark = `Timing ${Transform.name}:${transformContext}:${this.name}.execute`;
    try {
      startTimingSuccessful = startTiming(timingMark, this.log);
      return await this.executeImpl(pipe_in, passedIn);
    } catch (err) {
      return Promise.reject(processUnknownError(err, this.log));
    } finally {
      if(`...transform ${this.name}${transformContext.length ? ' on ' + transformContext : ''} ${this.errorCondition ? 'failed' : 'completed'}`.length  > maxLineLength) {
        this.log.info(`...transform ${this.name}`, this.errorCondition ? 'error' : 'task-done');
        this.log.info(`  on ${transformContext} ${this.errorCondition ? 'failed' : 'completed'}  ${startTimingSuccessful ? endTiming(
          timingMark,
          this.log) : ''}`, this.errorCondition ? 'error' : 'task-done');
      } else {
        this.log.info(`...transform ${this.name}${transformContext.length ? ' on ' + transformContext : ''} ${this.errorCondition ? 'failed' : 'completed'} ${startTimingSuccessful ? endTiming(
          timingMark,
          this.log) : ''}`, this.errorCondition ? 'error' : 'task-done');
      }
    }
  }

  abstract executeImpl(pipeIn: PIPE_IN | PASSED_IN | undefined, passedIn?: PASSED_IN): Promise<PIPE_OUT>;

  abstract transformContext(pipeIn: PIPE_IN | PASSED_IN| undefined, passedIn?: PASSED_IN): string;
}
