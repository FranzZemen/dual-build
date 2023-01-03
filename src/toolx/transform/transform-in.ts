/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {Transform} from './transform.js';


export type TransformInConstructor<CLASS extends TransformIn<PIPE_IN>, PIPE_IN> = new (logDepth: number) => CLASS;


/**
 * Abstract class that does consumes pipeline payload but does produce pipeline payload nor consume override payload.
 */
export abstract class TransformIn<PIPE_IN> extends Transform<undefined, PIPE_IN, void> {

  protected constructor(depth: number) {
    super(depth);
  }

  public async execute(pipeIn: PIPE_IN, passedIn = undefined): Promise<void> {
    return super.execute(pipeIn, undefined);
  }
}
