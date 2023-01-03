/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {DefaultPayload} from '../pipeline/pipeline-aliases.js';
import {Transform} from './transform.js';

export type TransformOutConstructor<CLASS extends TransformOut<OUT>, OUT = DefaultPayload> = new (logDepth: number) => CLASS;

/**
 * Abstract class that does not consume pipeline payload or override payload but  does produce pipeline output
 */
export abstract class TransformOut<OUTPUT> extends Transform<undefined, undefined, OUTPUT> {
  protected constructor(depth: number) {
    super(depth);
  }

  public async execute(payload: any, payloadOverride?: any): Promise<OUTPUT> {
    return super.execute(undefined, undefined);
  }
}
