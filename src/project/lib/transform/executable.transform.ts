/*
Created by Franz Zemen 02/06/2023
License Type: MIT
*/

import {Executable, ExecutablePayload, ExecutableResult} from '../../util/executable.js';
import {TransformPayloadOut} from '../../transform/index.js';


/**
 * The payload is either passed in or piped in, depending on which one extends/is ExecutablePayload
 */
export abstract class AbstractExecutableTransform<OUT = void> extends TransformPayloadOut<ExecutablePayload, OUT> {
  protected executable: Executable<ExecutablePayload>
  protected constructor(depth: number) {
    super(depth);
    this.executable = new Executable<ExecutablePayload>(this.contextLog);
  }
  protected executeImplPayloadOut(payload: ExecutablePayload): Promise<OUT> {
    return this.executable.exec(payload)
      .then(result=> this.resolution(result));
  }

  protected abstract resolution(result: ExecutableResult): Promise<OUT>;

  protected transformContext(pipeIn: any, payload: ExecutablePayload): string | object {
    return payload;
  }
}

export class ExecutableTransform extends AbstractExecutableTransform {
  constructor(depth: number) {
    super(depth);
  }

  protected resolution(result: ExecutableResult): Promise<void> {
    return Promise.resolve();
  }
}
