/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {Transform} from './transform.js';

export type TransformPayloadInConstructor<CLASS extends TransformPayloadIn<PASSED_IN, PIPE_IN>, PASSED_IN, PIPE_IN> = new (logDepth: number) => CLASS;

/**
 * Abstract class that does not consume pipeline payload but does produce pipeline payload and consumes override payload.
 */
export abstract class TransformPayloadIn<PASSED_IN, PIPE_IN> extends Transform<PASSED_IN, PIPE_IN, void> {
  protected constructor(depth: number) {
    super(depth);
  }

  public async execute(pipeIn: PIPE_IN, passedIn?: PASSED_IN): Promise<void> {
    return super.execute(pipeIn, passedIn);
  }
}
