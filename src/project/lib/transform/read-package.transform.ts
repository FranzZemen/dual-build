/*
Created by Franz Zemen 03/04/2023
License Type: 
*/

import {readFile} from 'fs/promises';
import path from 'path';
import {Package} from '../../options/index.js';
import {TransformPayloadOut} from '../../transform/index.js';
import {BuildError, BuildErrorNumber} from '../../util/index.js';

export type ReadPackagePayload = {
  targetPath: string;
}

export class ReadPackageTransform extends TransformPayloadOut<ReadPackagePayload, Package> {
  constructor(depth: number) {super(depth);}

  protected executeImplPayloadOut(payload: ReadPackagePayload): Promise<Package> {
    if(!payload) {
      return Promise.reject(new BuildError('Unreachable code',undefined, BuildErrorNumber.UnreachableCode));
    }
    this.contextLog.debug(payload.targetPath, 'info');
    return readFile(path.join(process.cwd(), payload.targetPath), {encoding: 'utf-8'})
      .then((data: string) => {
        // TODO: validate package.json
        let packageJson = JSON.parse(data);
        return packageJson;
      })
  }

  protected transformContext(pipeIn: undefined, passedIn: ReadPackagePayload | undefined): string {
    return `reading ${passedIn? passedIn.targetPath : ''}`;
  }

}
