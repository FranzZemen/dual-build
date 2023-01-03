/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {DefaultPayload} from '../pipeline/pipeline-aliases.js';
import {Transform} from './transform.js';


export type TransformInOutConstructor<
  CLASS extends TransformInOut<TRANSFORM_IN, TRANSFORM_OUT>,
  TRANSFORM_IN = DefaultPayload,
  TRANSFORM_OUT = DefaultPayload> = new (logDepth: number) => CLASS;


/**
 * Abstract class that does consumes and produces pipeline payload but does not consume override payload
 */
export abstract class TransformInOut<TRANSFORM_IN, TRANSFORM_OUT> extends Transform<undefined, TRANSFORM_IN, TRANSFORM_OUT> {

  protected constructor(depth: number) {
    super(depth);
  }

  public async execute(payload: TRANSFORM_IN, payloadOverride?: any): Promise<TRANSFORM_OUT> {
    return super.execute(payload, undefined);
  }
}
