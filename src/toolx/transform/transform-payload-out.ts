/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {Transform} from './transform.js';

export type TransformPayloadOutConstructor<CLASS extends TransformPayloadOut<PASSED_IN, PIPE_OUT>, PASSED_IN, PIPE_OUT> = new (logDepth: number) => CLASS;

/**
 * Abstract class that does not consume pipeline payload but does produce pipeline payload and consumes override payload.
 */
export abstract class TransformPayloadOut<PASSED_IN, PIPE_OUT> extends Transform<PASSED_IN, undefined, PIPE_OUT> {
  protected constructor(depth: number) {
    super(depth);
  }

  public async execute(pipeIn: undefined, passedIn?: PASSED_IN): Promise<PIPE_OUT> {
    return super.execute(undefined, passedIn);
  }
}
