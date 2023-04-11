/*
Created by Franz Zemen 02/03/2023
License Type: 
*/

import {BootstrapOptions} from '../../../options/index.js';
import {TransformPayloadIn} from '../../../transform/core/transform-payload-in.js';

export abstract class BootstrapTransform<PASSED_IN> extends TransformPayloadIn<PASSED_IN, BootstrapOptions> {
  public executeImplPayloadIn(pipeIn: BootstrapOptions, passedIn: PASSED_IN): Promise<void> {
    return this.executeBootstrapImpl(pipeIn, passedIn);
  }

  public abstract executeBootstrapImpl(bootstrapOptions: BootstrapOptions, passedIn?: PASSED_IN): Promise<void>;
}
