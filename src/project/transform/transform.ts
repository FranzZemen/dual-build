/*
Created by Franz Zemen 12/03/2022
License Type: MIT
*/


import {ConsoleCode} from '../log/index.js';
import {Log} from '../log/log.js';
import {processUnknownError} from '../util/index.js';
import {endTiming, startTiming} from '../util/timing.js';

export type TransformConstructor<CLASS extends Transform<any, any, any>> = new (logDepth: number) => CLASS;

/**
 * Abstract Transform class.  A Transform is a class that transforms data; data can be intrinsic (obtained by the class through internal means),
 * piped in (provided to the class by the starting Pipeline payload or by the previous Transform, SeriesPipe, or ParallelPipe piped out data, or
 * passed in directly when added to a Pipeline.
 *
 * The transform declares what kind of data it is sending down the Pipeline as output - this does not have to be the transformed data.
 */
export abstract class Transform<PASSED_IN, PIPED_IN, PIPE_OUT> {
  private readonly log: Log;
  protected contextLog: Log;
  protected errorCondition = false;

  protected constructor(protected depth: number) {
    this.log = new Log(depth);
    this.contextLog = new Log(depth+1);
  }

  get logDepth(): number {
    return this.log.depth;
  }

  set logDepth(depth: number) {
    this.log.depth = depth;
  }

  get name(): string {
    return this.constructor.name;
  }

  async execute(pipe_in: PIPED_IN, passedIn?: PASSED_IN): Promise<PIPE_OUT> {
    const transformContext: string | object = await this.transformContext(pipe_in, passedIn);
    const maxLineLength = 100;
    if (typeof transformContext === 'string') {
      const length = `transform ${this.name} ${transformContext} starting...`.length;
      if (length > maxLineLength) {
        this.log.info(`transform ${this.name}`);
        this.log.info(`  ${transformContext}`);
        this.log.info('  starting...');
      } else {
        this.log.infoSegments([
                                {data: `transform ${this.name} `, treatment: 'info'},
                                {data: transformContext, treatment: 'context'},
                                {data: ' starting...', treatment: 'info'}]);
      }
    } else {
      this.log.info(`transform ${this.name}`);
      // Use contextLog to indent the object
      this.contextLog.info(transformContext);
    }
    let startTimingSuccessful: boolean = true;
    const timingMark = `Timing ${Transform.name}:${transformContext}:${this.name}.execute`;
    try {
      startTimingSuccessful = startTiming(timingMark, this.log);
      return await this.executeImpl(pipe_in, passedIn);
    } catch (err) {
      return Promise.reject(processUnknownError(err, this.log));
    } finally {
      this.log.info(`...transform ${this.name} ${this.errorCondition ? 'failed' : 'completed'} ${startTimingSuccessful ? endTiming(timingMark,
                                                                                                                                   this.log) : ''}`,
                    this.errorCondition ? 'error' : 'task-done');
      /*
      if (typeof transformContext === 'string') {
        const length = `...transform ${this.name} on ${transformContext} ${this.errorCondition ? 'failed' : 'completed'}`.length;
        if (length > maxLineLength) {
          this.log.info(`...transform ${this.name} on`, this.errorCondition ? 'error' : 'task-done');
          this.log.info(`  ${transformContext}`);
          this.log.info(`${this.errorCondition ? 'failed' : 'completed'}  ${startTimingSuccessful ? endTiming(timingMark, this.log) : ''}`,
                        this.errorCondition ? 'error' : 'task-done');
        } else {
          this.log.infoSegments([
                                  `...transform ${this.name}`,
                                  `${transformContext.length ? ' on ' + transformContext : ''}`,
                                  ` ${this.errorCondition ? 'failed' : 'completed'} ${startTimingSuccessful ? endTiming(timingMark, this.log) : ''}`],
                                  this.errorCondition ? 'error' : 'task-done');
        }
      }
      out
       */
    }
  }

  protected abstract executeImpl(pipeIn: PIPED_IN | undefined, passedIn?: PASSED_IN): Promise<PIPE_OUT>;

  protected abstract transformContext(pipeIn: PIPED_IN | undefined, passedIn?: PASSED_IN): string | object | Promise<string | object>;
}
