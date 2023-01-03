/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {DefaultPayload} from '../pipeline/pipeline-aliases.js';
import {Transform} from './transform.js';

export type TransformPayloadInConstructor<CLASS extends TransformPayloadIn<PAYLOAD, IN>, PAYLOAD = DefaultPayload, IN = DefaultPayload> = new (logDepth: number) => CLASS;

/**
 * Abstract class that does not consume pipeline payload but does produce pipeline payload and consumes override payload.
 */
export abstract class TransformPayloadIn<PAYLOAD, IN> extends Transform<PAYLOAD, IN, void> {
  protected constructor(depth: number) {
    super(depth);
  }

  public async execute(payload: IN, payloadOverride?: PAYLOAD): Promise<void> {
    return super.execute(payload, payloadOverride);
  }
}
