/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {DefaultPayload} from '../pipeline/pipeline-aliases.js';
import {Transform} from './transform.js';

export type TransformPayloadOutConstructor<CLASS extends TransformPayloadOut<PAYLOAD, OUT>, PAYLOAD = DefaultPayload, OUT = DefaultPayload> = new (logDepth: number) => CLASS;

/**
 * Abstract class that does not consume pipeline payload but does produce pipeline payload and consumes override payload.
 */
export abstract class TransformPayloadOut<PAYLOAD, OUTPUT> extends Transform<PAYLOAD, undefined, OUTPUT> {
  protected constructor(depth: number) {
    super(depth);
  }

  public async execute(payload: undefined, payloadOverride?: PAYLOAD): Promise<OUTPUT> {
    return super.execute(undefined, payloadOverride);
  }
}
