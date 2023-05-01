/*
Created by Franz Zemen 04/30/2023
License Type: MIT
*/

import {Package} from '../../options/index.js';
import {AbstractExecutableTransform, ExecutablePayload, ExecutableTransform} from './executable.transform.js';

export class NpmVersionTransform extends AbstractExecutableTransform<Package> {
  constructor(depth: number) {
    super(depth);
  }
  protected override executeImplPayloadOut(payload: ExecutablePayload): Promise<OUT> {

  }

  protected resolution(result: Buffer | undefined): Promise<Package> {
    return Promise.resolve(undefined);
  }
}
