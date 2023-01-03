/*
Created by Franz Zemen 01/02/2023
License Type: MIT
*/

import {DefaultPayload} from '../pipeline/pipeline-aliases.js';
import {Transform} from './transform.js';

export type TransformPayloadConstructor<CLASS extends TransformPayload<PAYLOAD>, PAYLOAD = DefaultPayload> = new (logDepth: number) => CLASS;


/**
 * Abstract class that neither consumes nor produces pipeline payloads, but utilizes only the override payload.
 */
export abstract class TransformPayload<PAYLOAD> extends Transform<PAYLOAD, undefined, void> {
  protected constructor(depth: number) {
    super(depth);
  }

  public async execute(payload: undefined, payloadOverride?: PAYLOAD): Promise<void> {
    return super.execute(undefined, payloadOverride);
  }
}
