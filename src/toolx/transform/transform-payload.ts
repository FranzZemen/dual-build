/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {Transform} from './transform.js';

export type TransformPayloadConstructor<CLASS extends TransformPayload<PASSED_IN>, PASSED_IN> = new (logDepth: number) => CLASS;


/**
 * Abstract class that neither consumes nor produces pipeline payloads, but utilizes only the override payload.
 */
export abstract class TransformPayload<PASSED_IN> extends Transform<PASSED_IN, undefined, void> {
  protected constructor(depth: number) {
    super(depth);
  }

  public async execute(pipeIn: undefined, passedIn?: PASSED_IN): Promise<void> {
    return super.execute(undefined, passedIn);
  }
}
