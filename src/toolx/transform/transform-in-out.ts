/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {Transform} from './transform.js';


export type TransformInOutConstructor<
  CLASS extends TransformInOut<PIPE_IN, PIPE_OUT>, PIPE_IN, PIPE_OUT> = new (logDepth: number) => CLASS;


/**
 * Abstract class that does consumes and produces pipeline payload but does not consume override payload
 */
export abstract class TransformInOut<PIPE_IN, PIPE_OUT> extends Transform<undefined, PIPE_IN, PIPE_OUT> {

  protected constructor(depth: number) {
    super(depth);
  }

  public async execute(payload: PIPE_IN, passedIn = undefined): Promise<PIPE_OUT> {
    return super.execute(payload, undefined);
  }
}
