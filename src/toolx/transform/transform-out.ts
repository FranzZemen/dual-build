/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {Transform} from './transform.js';

export type TransformOutConstructor<CLASS extends TransformOut<PIPE_OUT>, PIPE_OUT> = new (logDepth: number) => CLASS;

/**
 * Abstract class that does not consume pipeline payload or override payload but  does produce pipeline output
 */
export abstract class TransformOut<PIPE_OUT> extends Transform<undefined, undefined, PIPE_OUT> {
  protected constructor(depth: number) {
    super(depth);
  }

  public async execute(pipeIn = undefined, passedIn = undefined): Promise<PIPE_OUT> {
    return super.execute(undefined, undefined);
  }
}
