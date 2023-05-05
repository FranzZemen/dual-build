/*
Created by Franz Zemen 04/30/2023
License Type: MIT
*/

import {Package} from '../../options/index.js';
import {TransformOut, TransformPayloadOut} from '../../transform/index.js';
import {Executable, ExecutablePayload} from '../../util/executable.js';
import {readProjectPackage} from '../../util/read-project-package.js';

export type NpmVersionIncrement = 'patch' | 'minor' | 'major';

export class NpmVersionTransform extends TransformPayloadOut<NpmVersionIncrement, Package> {
  protected executable: Executable<ExecutablePayload>;

  constructor(depth: number) {
    super(depth);
    this.executable = new Executable<ExecutablePayload>(this.contextLog);
  }

  protected transformContext(pipeIn: undefined, payload: NpmVersionIncrement): string | object | Promise<string | object> {
    return `npm version ${payload}`;
  }

  protected executeImplPayloadOut(passedIn: NpmVersionIncrement): Promise<Package> {
    return this.executable.exec({
                                  executable: 'npm version',
                                  arguments: [passedIn],
                                  batchTarget: false,
                                  synchronous: true,
                                  cwd: './'
                                })
               .then(result => readProjectPackage());
  }
}
