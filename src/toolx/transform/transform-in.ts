/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {DefaultPayload} from '../pipeline/pipeline-aliases.js';
import {Transform} from './transform.js';


export type TransformInConstructor<CLASS extends TransformIn<TRANSFORM_IN>, TRANSFORM_IN = DefaultPayload> = new (logDepth: number) => CLASS;


/**
 * Abstract class that does consumes pipeline payload but does produce pipeline payload nor consume override payload.
 */
export abstract class TransformIn<TRANSFORM_IN> extends Transform<undefined, TRANSFORM_IN, void> {

  protected constructor(depth: number) {
    super(depth);
  }

  public async execute(payload: TRANSFORM_IN, payloadOverride?:any): Promise<void> {
    return super.execute(payload, undefined);
  }
}
