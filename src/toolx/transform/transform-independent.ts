/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {Transform} from './transform.js';

export type TransformIndependentConstructor<CLASS extends TransformIndependent> = new (logDepth: number) => CLASS;


/**
 * Abstract class that neither consumes nor produces pipeline payloads, nor override payloads.
 */
export abstract class TransformIndependent extends Transform<undefined, undefined, void> {
  protected constructor(depth: number) {
    super(depth);
  }

  public async execute(payload:any, payloadOverride?: any): Promise<void> {
    return super.execute(undefined, undefined)
      .then(output => {return;});
  }
}
